import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'

export class CsvBulkRegistrationOnLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const putHandler = new lambdaNodejs.NodejsFunction(this, 'putHandler', {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: 'lambda/put-handler.ts',
        })

        const queueForPutHandler = new sqs.Queue(this, 'queueForPutHandler', {
            queueName: 'queueForPutHandler',
        })

        putHandler.addEventSource(
            new SqsEventSource(queueForPutHandler, {
                batchSize: 1,
                maxBatchingWindow: cdk.Duration.seconds(60),
                maxConcurrency: 1,
            })
        )
    }
}
