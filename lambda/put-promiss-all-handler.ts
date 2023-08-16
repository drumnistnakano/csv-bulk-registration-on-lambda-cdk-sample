import { S3Event } from 'aws-lambda'

exports.handler = async (event: S3Event): Promise<void> => {
    console.log(JSON.stringify(event, undefined, 2))
}
