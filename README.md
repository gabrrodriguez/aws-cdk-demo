# AWS Microservice Demo

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/fa8cd646-a241-4201-92a5-9f0261dd8d7c">
</p>

This is the architecture we will develop within this demo. This will be completed in a step by step format. 

-------

## Procedure

### Init Project

- [ ] Open a terminal session and `init` a project
```s 
cdk init app --language=typescript
```

> The result of this will be a project directory structure that we will continue to add to.

Ulitmately our project structure will consist of the following `root` level folders. There will be sub-folders and files, but the `dir-architecture` that we are implementing effectivley follows this construct.

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/d1879b6e-8f73-4c9c-8774-38a2be2ce44e">
</p>

- [ ] We will be utilizing a `monorepo` structure, but you could decide to use a `multi-repo` structure.

------

### Product Microservice

### 1. DynamoDB Table

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/4171845b-fab8-4301-8f37-1eec3627b3b2">
</p>

1. Within the `dir` structure, nav to the `/lib/aws-microservices-stacks.ts` file and input the following code which will provision the `product` table in DDB.
```js
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

    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps,
    })
    
    productTable.grantReadWriteData(productFunction)
```

> REFERENCE: _https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb-readme.html_

> REFERENCE: _https://github.com/gabrrodriguez/aws-cdk-dynamodb-table/tree/cdk-v2_

> REFERENCE: _https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html_

> REFERENCE: _https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib_

-------

### 2. Lambda 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/e1183b82-d51d-4ade-8c23-5e9790067186">
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

    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps,
    })
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

3. We will need to now depart from our _infrastructure_ provisioning process, and now think about our services. To do this we need to recall that our Service logic will reside in a folder called `src` which we don't currently have, so let's create it. 

3a. Within the `dir` structure create a dir called `src` at the same level as `bin` and `lib`. 

3b. This `src` folder will contain our microservice code, which we will have for `product`, `basket`, & `order`. Create these 3 sub-folders under `src`.

3c. Within the `src/product` folder create a file called `index.js`. Input the following code. You can see that the code only prints to the console, which is fine for now, we are just trying to ensure it is working. We will implement `product` specific logic later. 

```js
exports.handler = async function(event) {
    console.log("request", JSON.stringify(event, undefined, 2));
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello from Product Microservice! You have hit the ${event.path}\n`
    }
}
```

4. After we create our API Gateway, we will be able to send traffic to our lambda we just created, and test to see that it is working. 

-------

### 3. API Gateway

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/5577016b-5372-406c-b0b5-3b7d93c002c5">
</p>

1. Go to the AWS CDK and utilize the reference documentation for `api-gateway`. In the implementation you can see that there are several `api-gateway` nodes within the documentation. The difference correlates with the API Gateway options. (e.g. HTTPs, REST, Sockets, etc.)

2. Nav back to the `lib/aws-microservices-stack.ts` file. Let's begin by putting in some psuedo-code on the APIs that we will need create for the `product` service. 

```js
    // Product microservices api gateway
    // root name = product

    // GET /product
    // POST /product

    // Single product with id parameter
    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}
```

3. Now lets create the API Gateway resource for our `product` service that aligns to our psuedo-code. Input the following code.

```js
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
```

4. Ensure that the import statements are also aligned, to include `LambdaRestApi`. 
```js
import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
```

