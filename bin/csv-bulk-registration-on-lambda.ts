#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CsvBulkRegistrationOnLambdaStack } from '../lib/csv-bulk-registration-on-lambda-stack'

const app = new cdk.App()

new CsvBulkRegistrationOnLambdaStack(app, 'CsvBulkRegistrationOnLambdaStack')
