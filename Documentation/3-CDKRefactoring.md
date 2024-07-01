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

### 1. Refactor the `product` database

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

------

### 2. Refactor the `product` microservice

1. Create a file called `/lib/microservice.ts` and input the following code: 

```js
import { Construct } from 'constructs'

export class SwnMicroservices extends Construct {
    constructor ( scope: Construct, id: string ){
        super(scope, id)
    }
}
```

2. Now lets copy/paste our existing code from our `lib/aws-microservices-stack.ts` file to our `lib/microservice.ts` file: 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/df4b3e05-736c-40cf-9f2d-7b92b9745a80">
</p>

3. You'll see a series of errors from our copy/paste. Some of which we can resolve by importing the correct library references, you can do this for all but the `database` variable reference. 

4. So to fix the `database` we need to do 3 things: 1. We need to create an `Interface` class that will pass an attribute we can use (productTable) & 2. We need to incorporate the `interface` as a Props parameter to our `SwnMicroservice` class 3. We need to call the `props` to reference the `database.productTable`. 

4a. For Step 1 implement the following code above the class definition of `SwnMicroserices`

```js
// ... 
import { join } from 'path';

interface SwnMicroservicesProps {
    productTable: ITable
}

export class SwnMicroservices extends Construct {
    constructor ( scope: Construct, id: string ){
// ... 
```

4b. For Step 2, the `SwnMicroserviceProps` interface we just created needs to be passed as a parameter to the `SwnMicroservices` constructor. Input the following code: 

```js
// ... 
export class SwnMicroservices extends Construct {
    constructor ( scope: Construct, id: string, props: SwnMicroservicesProps ){
        super(scope, id)
// ...
```

4c. Now we can reference `props` as a replacement to `database` in our implemenation. Replace the remainder of the code block with this: 

```js
export class SwnMicroservices extends Construct {
    constructor ( scope: Construct, id: string, props: SwnMicroservicesProps ){
        super(scope, id)

        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: {
              externalModules: [
                'aws-sdk'
              ]
            },
            environment: {
              PRIMARY_KEY: 'id',
              DYNAMODB_TABLE_NAME: props.productTable.tableName
            },
            runtime: Runtime.NODEJS_16_X
          }
      
          // Product microservices lambda function
          const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
            entry: join(__dirname, `/../src/product/index.js`),
            ...nodeJsFunctionProps,
          })
      
          props.productTable.grantReadWriteData(productFunction);
    }
}
```

5. Now lets go back to the `aws-microservices-stack.ts` file and refactor this. To do this we will repeat the same 2 steps we executed when refactoring the database.ts file. 1. Comment out the code that was moved & 2. create an instance of the `SwnMicroservices` class as a reference. 

5a. Go to `/lib/aws-microservices-stack.ts` and comment out the following code: 

```js
    // const nodeJsFunctionProps: NodejsFunctionProps = {
    //   bundling: {
    //     externalModules: [
    //       'aws-sdk'
    //     ]
    //   },
    //   environment: {
    //     PRIMARY_KEY: 'id',
    //     DYNAMODB_TABLE_NAME: database.productTable.tableName
    //   },
    //   runtime: Runtime.NODEJS_16_X
    // }

    // // Product microservices lambda function
    // const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
    //   entry: join(__dirname, `/../src/product/index.js`),
    //   ...nodeJsFunctionProps,
    // })

    // database.productTable.grantReadWriteData(productFunction);
```

5b. Craete a new istance of `SwnMicroserices` class. 

```js
    const microservice = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable
    })
```

6. If you scroll down we still have one exception to remedy, which is the same issue that we experienced in Step 4 in the `Refactor the database` section. The `handler` is referencing `productFuntion` which is a reference to the `SwnMicroservice` that we have not created or made publically accessible. 

```js
    // Product microservices api gateway
    const apigw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'ProductSerivce',
      handler: productFunction,
      proxy: false
    });
```

To fix this we need to once again create a `public` `readonly` attribute in the `SwnMicroservice` class. Add the following code in `lib/microservice.ts`: 

```js
// ... 
export class SwnMicroservices extends Construct {

    public readonly productMicroservice: NodejsFunction

    constructor ( scope: Construct, id: string, props: SwnMicroservicesProps ){
        super(scope, id)
// ...
```

We also need to make a reference to `this` and the `productMicroservice` we just created. 

```js
  this.productMicroservice = productFunction
```

7. Finally you need to replace the reference in the `lib/aws-microservice-stack.ts`. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/329d5614-a931-4a6b-a950-3d961b352f17">
</p>

-----------

### 3. Refactor the `product` API Gateway

1. Create a file called `/lib/apigateway.ts` and input the following code: 

```js 
import { Construct } from "constructs";

export class SwnApiGateway extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id)
    
    }
}
```

2. Now Copy/Paste our API Gateway code from `lib/aws-microservices-stack.ts` file to `lib/apigateway.ts` file. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/8587dbbc-4015-497f-a9cf-2a0bdd14ce15">
</p>

3. Just like before you will have errors, some can be resolved by `Control+Space Bar` and an import of the corresponding AWS SDK library. Others we will have to construct attributes &/or an interface to refer to them. 

In this case we will create an interface. At the top of the file input the following code: 

```js
interface SwnApiGatewayProps {
    productMicroservice: IFunction
}
```

3a. Now paste the props in our constructor class so we can refernce them in our codeblock: 

```js
// ...
     constructor(scope: Construct, id: string, props: SwnApiGatewayProps ) {
// ... 
```

3b. Now we can make a reference to props in our `handler`

```js
    const apigw = new LambdaRestApi(this, 'productApi', {
        restApiName: 'ProductSerivce',
        handler: props.productMicroservice,
        proxy: false
      });
```

4. Finish our refactoring process by commenting out all the prior code in our `lib/aws-microservices-stack.ts` file. 

```js
    // // Product microservices api gateway
    // const apigw = new LambdaRestApi(this, 'productApi', {
    //   restApiName: 'ProductSerivce',
    //   handler: microservice.productMicroservice,
    //   proxy: false
    // });

    // // root name = product
    // const product = apigw.root.addResource('product')

    // // GET /product
    // product.addMethod('GET')

    // // POST /product
    // product.addMethod('POST')

    // // Single product with id parameter
    // const singleProduct = product.addResource('{id}')

    // // GET /product/{id}
    // singleProduct.addMethod('GET')

    // // PUT /product/{id}
    // singleProduct.addMethod('PUT')

    // // DELETE /product/{id}
    // singleProduct.addMethod('DELETE')
```

5. Finally we need to instantiate a new API Gateway instance with our newly created class.

```js
    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservice.productMicroservice
    })
```
---------

### 4. Final Clean up & Test

1. Now that the refactoring process is understood, you can delete all the commented code from the `lib/aws-microservice-stack.ts`. The final code should look like this: 

```js
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { SwnDatabase } from './database';
import { SwnMicroservices } from './microservices';
import { SwnApiGateway } from './apigateway';

export class AwsMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, 'Database')

    const microservice = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable
    })

    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservice.productMicroservice
    })
  }
}
```

2. Ensure that you have your `Docker Daemon` running and then run the following command: 

```js
cdk synth
```

