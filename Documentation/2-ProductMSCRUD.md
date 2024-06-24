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


