import { S3Event } from 'aws-lambda'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, PutCommand } from '@aws-sdk/lib-dynamodb'
import { sdkStreamMixin } from '@smithy/util-stream'
import { decode } from 'iconv-lite'
import { parse } from 'csv/sync'
import { faker } from '@faker-js/faker'
import { chunk } from 'lodash'

const s3 = new S3Client({ region: 'ap-northeast-1' })
const ddb = new DynamoDB({ region: 'ap-northeast-1' })
const ddbDoc = DynamoDBDocument.from(ddb)
const ddbTable = process.env.DYNAMODB_TABLE_NAME!

exports.handler = async (event: S3Event): Promise<void> => {
    const bucketName = event.Records[0].s3.bucket.name
    const filePath = decodeURIComponent(
        event.Records[0].s3.object.key.replace(/\+/g, ' ')
    )

    const usersCsvOutput = await s3.send(
        new GetObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        })
    )

    const csvSjisByteArray = await sdkStreamMixin(
        usersCsvOutput.Body
    ).transformToByteArray()
    const csvSjisBuffer = Buffer.from(csvSjisByteArray)
    const csvStr = decode(csvSjisBuffer, 'Shift_JIS')

    const rows: Array<{ userId: string }> = parse(csvStr, { columns: true })
    const items = rows.map((row) => ({
        testItemId: row.userId,
        createdAt: faker.date.recent().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
    }))

    const chunkedAllItems = chunk(items, 25)
    for (const items of chunkedAllItems) {
        await Promise.all(
            items.map((item) =>
            await ddbDoc.send(
                new PutCommand({
                    TableName: ddbTable,
                    Item: item,
                })
            )
        )
    }
}
