import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class CsvBulkRegistrationOnLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const ddbTable = new dynamodb.Table(this, 'TestItems', {
            tableName: 'TestItems',
            partitionKey: {
                name: 'testItemId',
                type: dynamodb.AttributeType.STRING,
            },
            pointInTimeRecovery: true,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        })

        const putHandler = new lambdaNodejs.NodejsFunction(this, 'putHandler', {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: 'lambda/put-handler.ts',
            timeout: cdk.Duration.minutes(15),
            memorySize: 10240,
            reservedConcurrentExecutions: 1, // 同時実行数1
            tracing: cdk.aws_lambda.Tracing.ACTIVE,
            architecture: cdk.aws_lambda.Architecture.ARM_64,
            environment: {
                DYNAMODB_TABLE_NAME: ddbTable.tableName,
            },
        })

        ddbTable.grantReadWriteData(putHandler)

        const putHandlerBucket = new s3.Bucket(this, 'putHandlerBucket', {
            bucketName: `${this.account}-put-handler-bucket`,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: true,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        })

        putHandlerBucket.grantRead(putHandler)

        putHandler.addEventSource(
            new S3EventSource(putHandlerBucket, {
                events: [s3.EventType.OBJECT_CREATED],
                filters: [
                    {
                        prefix: 'testitems/',
                    },
                ],
            })
        )

        const putPromissAllHandler = new lambdaNodejs.NodejsFunction(
            this,
            'putPromissAllHandler',
            {
                runtime: lambda.Runtime.NODEJS_18_X,
                entry: 'lambda/put-promiss-all-handler.ts',
                timeout: cdk.Duration.minutes(15),
                memorySize: 10240,
                reservedConcurrentExecutions: 1, // 同時実行数1
                tracing: cdk.aws_lambda.Tracing.ACTIVE,
                architecture: cdk.aws_lambda.Architecture.ARM_64,
                environment: {
                    DYNAMODB_TABLE_NAME: ddbTable.tableName,
                },
            }
        )

        ddbTable.grantReadWriteData(putPromissAllHandler)

        const putPromissAllHandlerBucket = new s3.Bucket(
            this,
            'putPromissAllHandlerBucket',
            {
                bucketName: `${this.account}-put-promiss-all-handler-bucket`,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                encryption: s3.BucketEncryption.S3_MANAGED,
                versioned: true,
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            }
        )

        putPromissAllHandlerBucket.grantRead(putPromissAllHandler)

        putPromissAllHandler.addEventSource(
            new S3EventSource(putPromissAllHandlerBucket, {
                events: [s3.EventType.OBJECT_CREATED],
                filters: [
                    {
                        prefix: 'testitems/',
                    },
                ],
            })
        )

        const batchWriteHandler = new lambdaNodejs.NodejsFunction(
            this,
            'batchWriteHandler',
            {
                runtime: lambda.Runtime.NODEJS_18_X,
                entry: 'lambda/batchwrite-handler.ts',
                timeout: cdk.Duration.minutes(15),
                memorySize: 10240,
                reservedConcurrentExecutions: 1, // 同時実行数1
                tracing: cdk.aws_lambda.Tracing.ACTIVE,
                architecture: cdk.aws_lambda.Architecture.ARM_64,
                environment: {
                    DYNAMODB_TABLE_NAME: ddbTable.tableName,
                },
            }
        )

        ddbTable.grantReadWriteData(batchWriteHandler)

        const batchWriteHandlerBucket = new s3.Bucket(
            this,
            'batchWriteHandlerBucket',
            {
                bucketName: `${this.account}-batchwrite-handler-bucket`,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                encryption: s3.BucketEncryption.S3_MANAGED,
                versioned: true,
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            }
        )

        batchWriteHandlerBucket.grantRead(batchWriteHandler)

        batchWriteHandler.addEventSource(
            new S3EventSource(batchWriteHandlerBucket, {
                events: [s3.EventType.OBJECT_CREATED],
                filters: [
                    {
                        prefix: 'testitems/',
                    },
                ],
            })
        )
    }
}
