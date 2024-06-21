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

### DynamoDB Table with AWS CDK

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

2. 


