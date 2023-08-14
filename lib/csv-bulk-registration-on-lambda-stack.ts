import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'

export class CsvBulkRegistrationOnLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const putHandler = new lambdaNodejs.NodejsFunction(this, 'putHandler', {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: 'lambda/put-handler.ts',
            timeout: cdk.Duration.minutes(15),
        })

        const putHandlerBucket = new s3.Bucket(this, 'putHandlerBucket', {
            bucketName: `${this.account}-put-handler-bucket`,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: true,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        })
    }
}
