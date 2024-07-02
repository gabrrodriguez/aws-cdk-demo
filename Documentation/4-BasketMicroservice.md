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
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/093c1867-0c9a-4a2a-85b6-e7a8357975f0">
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
