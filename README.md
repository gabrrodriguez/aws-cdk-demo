# AWS Microservice Demo

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/fa8cd646-a241-4201-92a5-9f0261dd8d7c">
</p>

-------

## Procedure

### Init Project & Determine Repo Strucute

- [ ] Open a terminal session and iniate a project
```s 
cdk init app --language=typescript
```

> The result of this will be a project directory structure that we will continue to add to.

- [ ] We will be utilizing a `monorepo` structure, but you could decide to use a `multi-repo` structure.

------

### Product Microservice

### DynamoDB Table

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/56b715da-c292-4b5f-a226-a3735d0554f2">
</p>

1. Within the `dir` structure, nav to the `/lib/aws-microservices-stacks.ts` file and input the following code which will provision the `product` table in DDB.
```js
import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs';

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
  }
}
```

> REFERENCE: _https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb-readme.html_

> REFERENCE: _https://github.com/gabrrodriguez/aws-cdk-dynamodb-table/tree/cdk-v2_

> REFERENCE: _https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html_

> REFERENCE: _https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib_

-------

### Lambda 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/4677e5b0-43a1-4f48-8dcc-c63400a7c1bc">
</p>

1. Within the `dir` structure, nav to the `/lib/aws-microservices-stacks.ts` file and input the following code after the `productTable` code block: 

```js
    const fn = new Function(this, 'MyFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset(join(__dirname, 'lambda-handler')),
    });
  }
```

You will add the following import statements to make the above code block work 

```js
import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';
```

This is the boilerplate implementation of a Lambda AWS CDK implementation, we will need to include the logic for the `product` function.

2. To provide the implementation specifics of the `product` lambda, we need to be more specific in our implmentation. Because we are implementing using NodeJS, try searching the AWS CDK documentation for `lambda nodejs`. Find the associated reference [here](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html). 

In this documenation you'll see a more specific implemenation of lambda. Using the NodeJS version of the Lambda implementation will account for the NodeJS functionality and bundling of the packages needed for implementation. 

Replace the prior lambda code block with this code: 

```js
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
```

Ensure the following imports are in place: 

```js
import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
```

-------
