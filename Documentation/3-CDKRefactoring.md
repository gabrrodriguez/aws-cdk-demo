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