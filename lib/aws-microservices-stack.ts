import * as cdk from 'aws-cdk-lib';
import { PrimaryKey } from 'aws-cdk-lib/aws-appsync';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Rule } from 'aws-cdk-lib/aws-events';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';


export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'product', {
      partitionKey: { 
        name: 'id', 
        type: AttributeType.STRING
      }, 
      tableName: 'product',
      removalPolicy: cdk.RemovalPolicy.DESTROY, 
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const nodeJSFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_16_X
    }

    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJSFunctionProps,
    })
    
    productTable.grantReadWriteData(productFunction)
  }
}
