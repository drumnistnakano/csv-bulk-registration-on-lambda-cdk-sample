import { S3Event } from 'aws-lambda'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { sdkStreamMixin } from '@smithy/util-stream'
import { decode } from 'iconv-lite'
import { parse } from 'csv/sync'

const s3 = new S3Client({})

exports.handler = async (event: S3Event): Promise<void> => {
    console.log(JSON.stringify(event, undefined, 2))
    const bucketName = event.Records[0].s3.bucket.name
    const filePath = decodeURIComponent(
        event.Records[0].s3.object.key.replace(/\+/g, ' ')
    )
    console.log(filePath)

    const usersCsvOutput = await s3.send(
        new GetObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        })
    )

    // Unit8Array取得
    const csvSjisByteArray = await sdkStreamMixin(
        usersCsvOutput.Body
    ).transformToByteArray()
    const csvSjisBuffer = Buffer.from(csvSjisByteArray)
    const csvStr = decode(csvSjisBuffer, 'Shift_JIS')

    const rows = parse(csvStr)
    console.log(rows)
}
