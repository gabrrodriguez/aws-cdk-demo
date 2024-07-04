# Basket Microservice CRUD Build

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/813c9d24-c734-470e-a7ac-39c53f8f4071">
</p>

-------


## Procedure 

### 1. DDB build for `basket`

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/b64205f2-da8c-4c0d-809d-bc8382693aa7">
</p>

The `basket` microservice has the following characteristics / use cases: 
- [ ] To syncronously add items to the basket
- [ ] Asyncronously process orders of the items in the basket
- [ ] Each user will have a basket
- [ ] Multiple Items can be added to the basket

1. Go to our `lib/database.ts` file. First compare the differences in database tables between the 2 ms. 

```js
export class SwnDatabase extends Construct {
  public readonly productTable: ITable

    constructor(scope: Construct, id: string ){
        super(scope, id)
        // Product DynamoDB Table Creation
        // product: PK - id, attributes: name, description, price, imageFile, category
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

        // Basket DynamoDB Table Creation 
        // basket: PK - userName attributes: items (Set-Map Objects) 
        // item1: { quantity, color, price, productId, productName}
    }
}
```

2. Now we will create our `basket` table in the same way that we created our `product` table. Implement the following code; 

```js
        // Basket DynamoDB Table Creation 
        // basket: PK - userName attributes: items (Set-Map Objects) 
        // item1: { quantity, color, price, productId, productName}
        const basketTable = new Table(this, 'basket', {
          partitionKey: {
            name: 'userName',
            type: AttributeType.STRING
          },
          tableName: 'basket',
          removalPolicy: RemovalPolicy.DESTROY,
          billingMode: BillingMode.PAY_PER_REQUEST
        });
      this.basketTable = basketTable
```

3. Ensure you instantiate the `basketTable` by placing the following line at the toip of the file: 

```js
  public readonly basketTable: ITable
```

4. This code can be refactored to isolate the constructor logic. In the current state each time the `SwnDatabase` class is called it will create a `product` and `basket` table; but these should be isolated from the constructor in the event that we only want to create 1 or the other or to add another database table. This pattern is known as `extractor method`. Here we will apply the `extractor method` To refactor the code change the code to this: 

```js
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class SwnDatabase extends Construct {
  public readonly productTable: ITable
  public readonly basketTable: ITable

  constructor(scope: Construct, id: string ){
      super(scope, id)
      this.productTable = this.createProductTable()
      this.basketTable = this.createBasketTable()
  }

  private createProductTable(): ITable {
    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'product',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return productTable
  }

  private createBasketTable(): ITable{
    const basketTable = new Table(this, 'basket', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING
      },
      tableName: 'basket',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return basketTable
  }
}
```

-------

### 2. Lambda build for `basket`

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/fbb66220-1bcf-470a-8504-e96fc768708d">
</p>

1. Open the `microservice.ts` file, and we will implement the same `extract pattern` that we used in the `database.ts` file. First create a reference to the 2 Function create methods that we will build. 

```js
  constructor ( scope: Construct, id: string, props: SwnMicroservicesProps ){
      super(scope, id)
      this.productMicroservice = this.createProductFunction(props.productTable)
      this.basketMicroservice = this.createBasketFunction(props.basketTable)
// ...
```

2. Next create an additional attribute for this class to publically make the `basketMicroservice` available: 

```js
  public readonly productMicroservice: NodejsFunction
  public readonly basketMicroservice: NodejsFunction
  ```

3. Now we need to ensure that this `basketMicroservice` will also have props available in the interface. 

```js
interface SwnMicroservicesProps {
    productTable: ITable
    basketTable: ITable
}
```

4. Now after the constructor, create the 2 functions: 

```js 
  private createProductFunction(productTable: ITable) : NodejsFunction {

    return productFunction
  }

  private createBasketFunction(basketTable: ITable) : NodejsFunction {

    return basketFunction
  }
```

5. Now populate the `createProductFunction` 

```js
  private createProductFunction(productTable: ITable) : NodejsFunction {
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

    productTable.grantReadWriteData(productFunction)

    return productFunction
  }
```

6. For the `basketFunction` we are replicating the code construct from `productFunction` but changing the references to be to the `baseket` Objects along with a change to the Primary Key in our DDB table. 

```js
  private createBasketFunction(basketTable: ITable) : NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: basketTable.tableName
      },
      runtime: Runtime.NODEJS_16_X
    }
    
    // Product microservices lambda function
    const basketFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/basket/index.js`),
      ...nodeJsFunctionProps,
    })
    
    basketTable.grantReadWriteData(basketFunction)

    return basketFunction
  }
```

7. Finally, if you return to your `aws-microservices-stack.ts` file, you will see an error. This is because we added a `basketTable` to our interface, but we didn't update the reference. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/10f06644-7d5a-4695-a31e-0be55a834ea0">
</p>

To fix this, in the `aws-microservices-stack.ts` file update the `microservice` create statement as follows: 

```js
    const microservice = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable
    })
```
-------

### 3. Create the boilerplate Lambda `handler` method for `basket` service

1. Create a file in the `/src/basket` folder called `index.js` and input the following code:

```js
exports.handler = async function(event) {
    console.log("request: ", JSON.stringify(event, undefined, 2))
    return{
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello from Basket! You're hit ${event.path}\n`
    }
}
```
--------

#### 4. Create the API Gateway infra for `basket`

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/bca9279b-4342-47a4-8a9a-fcb40ee40f2e">
</p>

1. Go to the `apigateway.ts` file. Here we are going to use psuedo-code to design our basket endpoints. 

```js
    // Basket microservices api gateway
    // root name = basket
    // GET /basket
    // POST /basket

    // resource/name = /basket/{userName}
    // GET /basket/{userName}
    // DELETE /basket/{userName}

    // POST /basket/checkout
```

2. Before we continue with the API Gateway build out, again its best to use the `extract pattern` to refactor our current class design. Change the existing code as follows. First create the two public attributes. 

```js
export class SwnApiGateway extends Construct {

    constructor(scope: Construct, id: string, props: SwnApiGatewayProps ) {
        super(scope, id)

        this.createProductApi(props.productMicroservice)
        this.createBasketApi(props.basketMicroservice)
// ...
```

3. Make sure to modify the interface `SwnApiGatewayProps` to the following: 

```js
interface SwnApiGatewayProps {
    productMicroservice: IFunction
    basketMicroservice: IFunction
}
```

4. Now create the methods to handle the `createProductApi()` and `createBasketApi()` methods: 

```js
    private createProductApi(productMicroservice: IFunction) {

    }

    private createBasketApi(basketMicroservice: IFunction) {

    }
```

5. Copy/paste and populate the `createProductApi()` method with the following code: 

```js
    private createProductApi(productMicroservice: IFunction) {
        // Product microservices api gateway
        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName: 'ProductSerivce',
            handler: productMicroservice,
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
```

6. Now we need to create the `createBasket()` method. Start by copy/paste the psuedo code to the method. 

```js
    private createBasketApi(basketMicroservice: IFunction) {
        // Basket microservices api gateway
        // root name = basket
        // GET /basket
        // POST /basket

        // resource/name = /basket/{userName}
        // GET /basket/{userName}
        // DELETE /basket/{userName}

        // resource/name = /basket/checkout
        // POST /basket/checkout

    }
```

7. Populate the psuedo code with actual implementation code: 

```js
private createBasketApi(basketMicroservice: IFunction) {
        // Basket microservices api gateway
        const apigw = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'BasketSerivce',
            handler: basketMicroservice,
            proxy: false
        });

        // root name = basket
        const basket = apigw.root.addResource('basket')

        // GET /basket
        basket.addMethod('GET')

        // POST /basket
        basket.addMethod('POST')

        // resource/name = /basket/{userName}
        const singleBasket = basket.addResource('{username}')

        // GET /basket/{userName}
        singleBasket.addMethod('GET')

        // DELETE /basket/{userName}
        singleBasket.addMethod('DELETE')

        // resource/name = /basket/checkout
        const basketCheckout = basket.addResource('checkout')

        // POST /basket/checkout
        basketCheckout.addMethod('POST')   // expected payload: {userName: swn}
    }
```

8. Last piece is we have to ensure that our Interface on the `apigateway.ts` file and the `aws-microservices-stack.ts` file have the same attributes: 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/0cd40014-8e38-4356-a83a-4402a75590da">
</p>

```js
    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservice.productMicroservice,
      basketMicroservice: microservice.productMicroservice
    })
```
-------

### 5. Lets deploy and Test

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/be1c0417-3d7f-49b5-aa88-d303dc38e34b">
</p>

1. To deploy run your `cdk` sequence of commands

```js
cdk synth
cdk diff
cdk deploy
```

2. Notice that at the deployment there are 2 API endpoints created for us. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/ff061609-335a-46f7-90ff-9fcc482bccaa">
</p>

3. Setup your testing in Postman for the new `basket` routes. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/61ec6515-1309-4155-be0c-1b3a33e05a77">
</p>

---------

### 6. Add Logic to the `basket` lambdas

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/37de0f92-61e1-4fcc-8e50-0310c59464fa">
</p>

1. Nav to the `src/basket` dir, and create a file called `package.json`. Within that file input the following code: 

```js
{
    "name": "@src/product",
    "version": "1.0.0",
    "main": "index.js",
    "dependencies": {

    }
  }
```

2. Now in a terminal session (again make sure you are in the `/src/basket` dir) run the following commands: 

```js
npm install @aws-sdk/client-dynamodb
npm install @aws-sdk/util-dynamodb
```

The command will input dependencies in your `package.json` file. This dir should now have a new dir called `node_modules`, `package-lock.json`, and following contents of the `package.json` file: 

```js
{
    "name": "@src/product",
    "version": "1.0.0",
    "main": "index.js",
    "dependencies": {
        "@aws-sdk/client-dynamodb": "^3.609.0",
        "@aws-sdk/util-dynamodb": "^3.609.0"
    }
}
```

3. Like we did in our product service we are going to create a `ddbClient` to help reduce the size of the package that will be uploaded to Lambda. This will simply be a utility file that will referene the AWS SDK `DynamoDBClient`.  Create a file called `ddbClient` and input the following content: 

```js
// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient();
export { ddbClient };
```

4. Now nav over to our `src/basket/index.js` file and let's input psuedo code to define what we are about to do to our Lambda. Recall in our `product` service we used a switch statement to process the `event` method and excecise the correct logic. We will do the same here. Input the following psuedo code above our `response` message: 

```js
exports.handler = async function(event) {
    console.log("request: ", JSON.stringify(event, undefined, 2))
    
    // Todo - switch case event.httpMethod to perform add/remove basket actions
    // and add checkout basket operations with using the ddbClient object
    
    // GET /basket
    // POST /basket
    // GET /basket/{userName}
    // DELETE /basket/{userName}
    // POST /basket/checkout

    return{
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello from Basket! You're hit ${event.path}\n`
    }
}
```

5. Much of this same code was implemented in the `product` ms. Start by copy/pasting the following code to the `basket` service and then we will refactor. Extract the following code from `src/product/index.js` file and paste in the `src/basket/index.js` file. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/22730676-6177-4d16-a537-6faa7d0efb71">
</p>

6. Now refactor the code to account for just the requests we need. Your code should now look like this in the `src/basket/index.js` file: 

```js
exports.handler = async function(event) {
    console.log("request: ", JSON.stringify(event, undefined, 2))
    
    // Todo - switch case event.httpMethod to perform add/remove basket actions
    // and add checkout basket operations with using the ddbClient object
    
    // GET /basket +
    // POST /basket +
    // GET /basket/{userName} +
    // DELETE /basket/{userName} +
    // POST /basket/checkout +
    let body = {};   // initialize body our you will receive a runtime error
    try {
      switch (event.httpMethod) {
        case "GET":
          if (event.pathParameters != null) {
            body = await getBasket(event.pathParameters.userName);   // GET /basket/{userName}
          } else {
            body = await getAllBaskets(); // GET /basket
          }
          break;
        case "POST":
          if (event.pathParameters == "/basket/checkout") {
            body = await checkoutBasket(event);   // POST /basket/checkout
          } else {
            body = await createBasket(event)   // POST /basket
          }
          break;
        case "DELETE":
          body = await deleteBasket(event.pathParameters.userName); // DELETE /basket/{userName}
          break;
        default:
          throw new Error(`Unsupported route: "${event.httpMethod}"`);
      }
      console.log(body);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully finished operation: "${event.httpMethod}"`,
          body: body
        })
      };
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to perform operation.",
          errorMsg: e.message,
          errorStack: e.stack,
        })
      };
    }
}
```

7. Now we need to implement the methods that we created in our `switch` statement. Below our switch statement we need to write the implementation for: 
- [ ] getBsket()
- [ ] getAllBaskets()
- [ ] checkoutBasket()
- [ ] createBasket()
- [ ] deleteBasket()

So lets begin by simply writing the method signatures for each of the methods we need to create. Update the `src/basket/index.js` file with the following: 

```js
const getBasket = async (userName) => {
    console.log(`You have called the getBasket() method`)
    // Implement function    
}

const getAllBaskets = async () => {
    console.log(`You have called the getAllBaskets() method`)
    // Implement function
}

const checkoutBasket = async (event) => {
    console.log(`You have called the checkoutBasket() method`)
    // Implement function
}

const createBasket = async (event) => {
    console.log(`You have called the createBasket() method`)
    // Implement function
}

const deleteBasket = async (userName) => {
    console.log(`You have called the deleteBasket() method`)
    // Implement function   
}
```

8. Let's begin with `getBasket()` method implementation. Here we need to take the Username to execute a query on DDB and execute a return of the basket by that user. We need to wrap our logic in a try/catch block. The result of the query will become the body that we pass to the API gateway response. 

```js
const getBasket = async (userName) => {
    console.log(`You have called the getBasket() method`)
    // Implement function    
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ userName: userName })
        }
        const { Item } = await ddbClient.sent(new GetItemCommand(params))
        console.log(Item)
        return Item ? unmarshall(Item) : {}
    } catch (e) {
        console.log(e)
        throw e
    }
}
```

Be sure to add the import statements as well. In this case you can simply copy paste our import statements from the `src/product/index.js` as we will be using at least the same modules in the basket serivce. Copy / paste the following code into the top of the `src/basket/index.js` file. 


```js
import { DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";
```

9. Now write the logic for the `getAllBaskets()` method. Here we will use the AWS SDK `ScanCommand` to return all results in our DDB table. Input the following code: 

```js
const getAllBaskets = async () => {
    console.log(`You have called the getAllBaskets() method`)
    // Implement function
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
        }
        const { Items } = await ddbClient.send(new ScanCommand(params))
        console.log(Items)
        return (Items) ? Items.map((item) => unmarshall(item)) : {}

    } catch (e) {
        console.log(e)
        throw e
    }
}
```

10. Now write the logic for `createBasket()` method. This will be the same as what we did for creating a Product, where we will assign a basketId using the uuid library (so don't forget this import). Input the following code: 

```js
const createBasket = async (event) => {
    console.log(`createBasket function. event : "${event}"`);
    try {
      const requestBody = JSON.parse(event.body);
      // set productid
      const basketId = uuidv4();
      requestBody.id = basketId;
  
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: marshall(requestBody || {})
      };
  
      const createResult = await ddbClient.send(new PutItemCommand(params));
  
      console.log(createResult);
      return createResult;
  
    } catch(e) {
      console.error(e);
      throw e;
    }
}
```

11. Now lets implement the `deleteBasket()` method. Again we can use the `product` implementation as an example. Input the following code: 

```js
const deleteBasket = async (userName) => {
    console.log(`You have called the deleteBasket() method: username: ${userName}`)
    // Implement function

    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ userName: userName }),
      };
  
      const deleteResult = await ddbClient.send(new DeleteItemCommand(params));
  
      console.log(deleteResult);
      return deleteResult;
    } catch(e) {
      console.error(e);
      throw e;
    }
}
```

12.