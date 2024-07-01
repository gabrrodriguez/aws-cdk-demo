# AWS CDK Organization Best Practice

We have utilized AWS CDK to 1. Create the `AWSMicroservicesStack` and 2. Create the `product` microservice and its associated logic captured in our APIs. Before creating more AWS services we need to evaluate if the current construct (from a code organization) standpoint is the best way to utilize our files and dir architecture to create additional services like `basket` and `orders`. 

If you research a bit on best practice for organizing services and the files for building microservices you will find that the recommended approach is something similar to the article you find [here](https://aws.amazon.com/blogs/developer/recommended-aws-cdk-project-structure-for-python-applications/)

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/71ac46a1-2708-4938-ba0c-b745da210488">
</p>

> NOTE: This example refers to a python project where we are using NodeJs, but the construct for the project architecture remains the same. 

Essentially the recommendation is to utilize our code file construct and seperate resource logic along with the architectural layers. The construct can be visually depicted like this: 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/8fbf5c50-2b35-4cc7-9b08-3b3f8c7d35a6">
</p>

--------

## Procedure

1. Under the `/lib` dir, create a file called `database.ts` and input the following code.

```js
import { Construct } from "constructs";

export class SwnDatabase extends Construct {
    constructor(scope: Construct, id: string ){
        super(scope, id)
        
    }
}
```

> NOTE: The `Swn` prefix is a generic prefix associated with the application we are building this for. It could be anything. The point I'm highlighting with this is to ensure that there is some means of generating a distinguishable naming convention as the resources are built.

2. Now move over our existing `product` table, created in `aws-microservices-stack.ts` file. Copy/paste into our new `database.ts` file: 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/9ecf1db5-6156-4161-938b-7b125b46b904">
</p>

The updated `database.ts` file should look like this: 

```js
import { Construct } from "constructs";

export class SwnDatabase extends Construct {
    constructor(scope: Construct, id: string ){
        super(scope, id)

        // Product DynamoDB Table Creation
        const productTable = new Table(this, 'product', {
            partitionKey: {
              name: 'id',
              type: AttributeType.STRING
            },
            tableName: 'product',
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
          });
    }
}
```

> NOTE: Correct the errors in the `database.ts` file, by importing the library references. On a MacOS you can do so by selecting the end of the word and pressing `Control+Space Bar` which should show the reference which you can select and the import will occur for you. 


3. Now go back to the `aws-microservice-stack.ts` and ensure the reference to the newly created `SwnDatabase` is configured. 

- [ ] Comment out the old code
- [ ] Create a new instance of the `SwnDatabase` and assign it to the variable name `database`
- [ ] import the `SwnDatabase` from the `./database.ts` file

```js
// ...
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
// ...
```

4. When you implement this change, you can see as you scroll down the `aws-microservice-stack.ts` file that there is still an exception being thrown with the use of environment variables that we previously set with the `productTable` reference. This is b/c we no longer have a `productTable` variable within this class (we've commented it out). 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/259bdc52-ab0a-4910-b9b6-aef697edebe4">
</p>

If you look back at the `SwnDatabase` class, you see that we use the `productTable` attribute within the class construct. We simply need to make it publically avaialble so when this class is used in other code blocks, we can reference it. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/1efb7cba-f152-4133-a17b-3cb285c034e3">
</p>

The way we will fix this is by implementing a public field. Update the `/lib/database.ts` with the following code: 

```js
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class SwnDatabase extends Construct {
  public readonly productTable: ITable

    constructor(scope: Construct, id: string ){
        super(scope, id)
        // Product DynamoDB Table Creation
        const productTable = new Table(this, 'product', {
            partitionKey: {
              name: 'id',
              type: AttributeType.STRING
            },
            tableName: 'product',
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
          });
        this.productTable = productTable
    }
}
```

Ensure that you also update the references in the `/lib/aws-microservices-stack.ts` by adding the prefix `database.productTable` to the references in the file: 

```js
// ...
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: database.productTable.tableName
      },
      runtime: Runtime.NODEJS_16_X
    }

    // Product microservices lambda function
    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps,
    })

    database.productTable.grantReadWriteData(productFunction);
// ...
```

