# Product Microservice CRUD Build

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/fa8cd646-a241-4201-92a5-9f0261dd8d7c">
</p>

This is the architecture we will develop within this demo. This will be completed in a step by step format. 

-------

## Procedure

### 1. AWS SDK

Get familiar with the AWS SDK.

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/12bd7cc2-c947-41dd-9d2c-07d78799a439">
</p>

A few reasons to point out as to why we will use AWS SDK
- [ ] `Product` Lambda microservice function runtime is NodeJS and there is native support within the AWS SDK
- [ ] AWS SDK also has support for JavaScript version 3
- [ ] `Typescript` support is avaiable in AWS SDK

> REFERENCE: [AWS Tools](https://aws.amazon.com/developer/tools/)

> REFERENNCE: [AWS SDK for Javascript - Developer Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-browser.html)

> REFERENCE: [AWS SDK for Javascript version 3 API Reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

### 2. Add `package.json` and dependencies to your `product` service

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/4e01ad22-6fa3-4452-a8de-475a9869cffa">
</p>

1. First we will be install `npm` dependencies within our `products` ms. We can manage our dependencies with a `package.json` file. Create this file within your `/src/product` dir. 

2. Within the `package.json` file input the following code: 

```s
{
  "name": "@src/product",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    
  }
}
```

3. Now we have a file were each `npm install` command we run, the NodeJS framework will log these modules with a JSON node called `dependencies` within the `package.json` file. Start by installing the `@aws-sdk/client-dynamodb` dependencies. To do this in the termianl run the following command:

```js
// make sure you are in the `/src/product` dir
npm install @aws-sdk/client-dynamodb
```

4. If this commnad ran without error, then you will see additional files added to your `src/product` folder. You should see 1. `node_modules` & 2. `package-lock.json` files added. 

If you open your `package.json` file you should see you `dependencies` node populated with `"@aws-sdk/client-dynamodb": "^3.602.0"`. 

5. We have 1 more package to install which is `@aws-sdk/util-dynamodb`. Enter the following code: 

```s
npm install @aws-sdk/util-dynamodb
```

Your `package.json` file should now look like this: 

```json
{
  "name": "@src/product",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.602.0",
    "@aws-sdk/util-dynamodb": "^3.602.0"
  }
}
```

### 3. Examine the event that will be passed from API Gateway to Lambda

1. Before we invoke a call to Lambda for our `product` service, we should look at the `event` object that will be sent from API Gateway to Lambda to understand what data will be available to us. 

You can view this in the docs [here](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html). 

You can see that a `synchronous` event is passed from API Gateway to Lambda and you can see the JSON key:value mappings. 

2. We will use the event attributes to perform a switch operation on our `httpMethod` so we can execute our CRUD operations. A notional example can be seen in the code below. 

```js
exports.handler = async function(event) {
    console.log("request", JSON.stringify(event, undefined, 2));

    // Todo - switch case event.httpmethod to perform CRUD operations using the ddbClient object

    if(event.httpmethod == "GET") {
        doStuff()
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello from Product Microservice! You have hit the ${event.path}\n`
    }
}
```

3. Instead of using an `if statement` we will swap for a `switch` statement and implement our CRUD for our various HTTP methods. We will start with our `GET` method for both `GET all Products` and `GET a Product`. We can specify the difference with an if statement evaluating whether or not the request has a `pathParameter` of `product.id`. If it does, we retrieve a single product. If it does not, then we retrieve all products. Replace the if statement code block in Step 2 with the swith statement code block below: 

```js
    switch(event.httpmethod) {
        case "GET": 
            if(event.pathParameters != null) {
                body = await getProduct(event.pathParameters.id)
            } else {
                body = await getAllProducts()
            }
    }
```

-------

### 4. Develop CRUD capability for DDB

1. While we evaluate the Lambda CRUD functions, they will interface directly to the DDB table. We should examime WHAT capability does DDB SDK provide so we can determine how to interact with the Tables. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/da4c4138-92de-4137-857b-a53cc115fabe">
</p>

2. You can utilize the `Amazon DynamoDB` documentaiton for input on API operations. See documentation [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html). The 4 primary methods that we will use from this documenation and we will incorporate to the lambda functions to interface to DDB are the following: 
- [ ] `PutItem`
- [ ] `GetItem`
- [ ] `UpdateItem`
- [ ] `DeleteItem`

3. Now lets implement the AWS SDK that will allow us to import DDB libraries and utilize the functionality we called out in Step 2 above. Return to our reference AWS SDK documentation to see examples. [here](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html). Here we will implement a `try/catch` block, and marshall our product definition to JSON Object that will be stored in our DDB table. Enter the following code: 

```js
const getProduct = async(productId) => {
    console.log(`getProduct API`)

    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: marshall({ id: productId })
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}
```

To utilize the `marshall` function, you will need to import the `marshall` function from the `@aws-sdk/util-dynamodb` library. 

```s
const { marshall } = require("@aws-sdk/util-dynamodb");
```

> REFERENCE: See definition of `marshall`
<p align="center">
<img width="334" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/1f23b133-125c-47c9-b7d2-8457a0e2a592">
</p>

> REFERENCE: Note the use of `environment variables`. Recall we defined these env variables in our `lib/aws-microservices-stack.ts` file when we provisioned our DDB table using AWS CDK. See graphic below. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/1a894fa5-0f55-499c-b29f-878c0e22c48f">
</p>

4. In the above step, we simply provided "what" needs to be written to the ddb table, but we didn't specify a method to do so. We need to call the `ddb client` and utilize the `send()` method with a new Item Object `GetItemCommand()` to write to the `ddb table`. To do this replace the code block in Step 3 with the following: 

```js
const getProduct = async(productId) => {
    console.log(`getProduct API`)

    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: marshall({ id: productId })
        }

        const { Item } = await DynamoDBClient.send(new GetItemCommand(params))
        console.log( Item )
        return ( Item ) ? unmarshall( Item ) : {}

    } catch (e) {
        console.log(e)
        throw e
    }
}
```

Go back to your import statements and ensure that they are ES6 implementation that will utilize the `import` statement vs. the legacy method which uses `require`. This will matter when we bundle applications. 

```js
// Old - ES5
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

// Update to - ES6
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
```

5. Now that we created `getProduct` we also want to `getProducts`. Implement this API with the following code: 

```js
const getAllProducts = async () => {
    console.log(`Get all Products`)
    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME
        }
        const { Items } = await DynamoDBClient.send(new ScanCommand(params))
        console.log( Items )
        return ( Items ) ? unmarshall( Item ) : {}
    } catch (error) {
        console.log(e)
        throw e
    }
}
```

Ensure that all the required import statements are provided. 

```js
import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Table } from "aws-cdk-lib/aws-dynamodb";
```

6. In above steps we created APIs to "GET" products. Lets now add functionality to "POST" (aka Create) products. To do this begin with modifying our `switch` statement to include instances where our `event.pathParametes` when providing `POST` method, will know what do do. Also add a `default` case as well. Update our `switch` code block as follows: 

```js
    switch(event.httpmethod) {
        case "GET": 
            if(event.pathParameters != null) {
                body = await getProduct(event.pathParameters.id)
            } else {
                body = await getAllProducts()
            }
        case "POST": 
            body = await createProduct(event)
            break
        default: 
            throw new Error(`Unsupported route: ${event.httpMethod}`)
    }
```

7. Now create the implementation for our `createProduct()` function. Input the following code: 

```js
const createProduct = async (event) => {
    console.log(`createProduct function event: ${event}`)
    try {
        const requestBody = JSON.parse(event.body)
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: marshall( requestBody || {} )
        }
        const createResult = await DynamoDBClient.send(new PutItemCommand(params))
        console.log(createResult)
        return createResult
    } catch (error) {
        console.log(e)
        throw e
    }
}
```

8. When we create a new `product` we want to ensure that the `product` has a unique id, therefore we will use the `uuid` library to assign a unique id to the record. To do this input the following code: 

```js
// enter import statement at top of index.js file
import { v4 as uuidv4 } from 'uuid'
```

Now utilize the uuid import within the `createProduct()` method. Update the prior `createProduct()` code block to the following code: 

```js 
const createProduct = async (event) => {
    console.log(`createProduct function event: ${event}`)
    try {
        const productRequest = JSON.parse(event.body)

        // create a unique uuid and assing to id field
        const productId = uuidv4()
        productRequest.id = productId

        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: marshall( productRequest || {} )
        }
        const createResult = await DynamoDBClient.send(new PutItemCommand(params))
        console.log(createResult)
        return createResult
    } catch (error) {
        console.log(e)
        throw e
    }
}
```

9. Now we can create a DELETE method. For this first update our `switch` statement with a `DELETE` case. Replace the existing `switch` block with the following code: 

```js
    switch(event.httpmethod) {
        case "GET": 
            if(event.pathParameters != null) {
                body = await getProduct(event.pathParameters.id)
            } else {
                body = await getAllProducts()
            }
        case "POST": 
            body = await createProduct(event)
            break
        case "DELETE":
            body = await deleteProduct(event.pathParameters.id)
            break
        default: 
            throw new Error(`Unsupported route: ${event.httpMethod}`)
    }
```

10. Now implement the `deleteProduct()` logic. Input the following code: 

```js
const deleteProduct = async (productId) => {
    console.log(`deleteProduct function productId: ${productId}`)

    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: marshall({ id: productId })
        }
        const deleteResult = await DynamoDBClient.send(new DeleteItemCommand(params))
        console.log(deleteResult)
        return deleteResult


    } catch (error) {
        console.log(e)
        throw e
    }
}
```

11. Lets input our final method for this endpoint which is the PUT method for our `product` service. To do this add an additional swtich statement. Replace the `switch` code block with the following code: 

```js
    switch(event.httpmethod) {
        case "GET": 
            if(event.pathParameters != null) {
                body = await getProduct(event.pathParameters.id)
            } else {
                body = await getAllProducts()
            }
        case "POST": 
            body = await createProduct(event)
            break
        case "DELETE":
            body = await deleteProduct(event.pathParameters.id)
            break
        case "PUT": 
            body = await updateProduct(event.pathParameters.id)
            break
        default: 
            throw new Error(`Unsupported route: ${event.httpMethod}`)
    }
```

12. Now lets implment the `updateProduct` implementation. Input the following code: 

```js
const updateProduct = async (event) => {
    console.log(`updateProdcut function event:  ${event}`)

    try {
        const requestBody = JSON.parse(event.body)
        const objKeys = Object.keys(requestBody)

        console.log(`updateProduct function requestBody: ${requestBody}, objKeys: ${objKeys} `)

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: event.pathParameters.id }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: requestBody[key],
            }), {})),
          };

          const updateResult = await DynamoDBClient.send(new UpdateItemCommand(params))
          console.log(updateResult)
          return updateResult
          
    } catch (e) {
        console.log(e)
        throw e
    }
}
```

-------