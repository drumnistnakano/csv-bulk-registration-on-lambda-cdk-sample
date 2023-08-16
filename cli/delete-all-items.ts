import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { chunk } from 'lodash'

const main = async () => {
    const ddbDoc = DynamoDBDocument.from(
        new DynamoDB({ region: 'ap-northeast-1' })
    )

    let items =
        (
            await ddbDoc.scan({
                TableName: 'TestItems',
            })
        ).Items ?? []

    while (items.length > 0) {
        const chunkedItems = chunk(items, 25)
        for (const items of chunkedItems) {
            await ddbDoc.batchWrite({
                RequestItems: {
                    TestItems: items.map((item) => ({
                        DeleteRequest: {
                            Key: {
                                testItemId: item.testItemId,
                            },
                        },
                    })),
                },
            })
        }

        items =
            (
                await ddbDoc.scan({
                    TableName: 'TestItems',
                })
            ).Items ?? []
    }
}

main()
