import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { SwnDatabase } from './database';

export class AwsMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, 'Database')

    // const productTable = new Table(this, 'product', {
    //   partitionKey: {
    //     name: 'id',
    //     type: AttributeType.STRING
    //   },
    //   tableName: 'product',
    //   removalPolicy: RemovalPolicy.DESTROY,
    //   billingMode: BillingMode.PAY_PER_REQUEST
    // });

    const nodeJsFunctionProps: NodejsFunctionProps = {
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

    // Product microservices lambda function
    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps,
    })

    productTable.grantReadWriteData(productFunction);

    // Product microservices api gateway
    const apigw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'ProductSerivce',
      handler: productFunction,
      proxy: false
    });

    // root name = product
    const product = apigw.root.addResource('product')

    // GET /product
    product.addMethod('GET')

    // POST /product
    product.addMethod('POST')

    // Single product with id parameter
    const singleProduct = product.addResource('{id}')

    // GET /product/{id}
    singleProduct.addMethod('GET')

    // PUT /product/{id}
    singleProduct.addMethod('PUT')

    // DELETE /product/{id}
    singleProduct.addMethod('DELETE')
  }
}