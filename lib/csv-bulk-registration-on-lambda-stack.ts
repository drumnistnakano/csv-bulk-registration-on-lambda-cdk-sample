import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class CsvBulkRegistrationOnLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambdaNodejs.NodejsFunction(
      this,
      "CsvBulkRegistrationHandler",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: "lambda/handler.ts",
      }
    );
  }
}
