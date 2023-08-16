import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const main = async () => {
    const ddbDoc = DynamoDBDocument.from(
        new DynamoDB({ region: 'ap-northeast-1' })
    )
    let exclusiveStartKey: any | null | undefined = null
    let count = 0
    while (exclusiveStartKey !== undefined) {
        const result = await ddbDoc.scan({
            TableName: 'TestItems',
            ExclusiveStartKey: exclusiveStartKey ?? undefined,
        })
        exclusiveStartKey = result.LastEvaluatedKey
        count += result.Items?.length ?? 0
    }
    console.log({ count })
}

main()
