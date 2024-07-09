# Orders Microservice

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/957c98c8-7bc4-49cd-98c8-d7a51879122b">
</p>

## Procedure

### 1. Create Ordering Table in DDB

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/999318e4-bdf3-4212-8d8e-bd04125dbf3b">
</p>

1. We already have our `Table` construct built for our prior 2 services, so we can simply extend the same pattern to build out the Ordering table. Start with exposing a public attribute to our class for the Order Table. 

```js
  public readonly productTable: ITable
  public readonly basketTable: ITable
  public readonly orderTable: ITable
```

2. Now modifty the constructor to utilize this attribute within our Construct. 

```js
  constructor(scope: Construct, id: string ){
      super(scope, id)
      this.productTable = this.createProductTable()
      this.basketTable = this.createBasketTable()
      this.orderTable = this.createOrderTable()
  }
```

This `creatOrderTable()` method doesn't exist, so lets create it. 

3. Create a new method called `createOrderTable()`

```js
  private createOrderTable() : ITable {
    const orderTable = new Table(this, 'order', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING,
      },
      tableName: 'order',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return orderTable;
  }
```

4. Now we need to consider what our primary and potentially our secondary key strategy is so we can ensure that the current method construct is the one we want to keep. Consider what the fields are that we want to maintain in the order table. 

```js
    // Order Table
    // Order: PK: serName, SK: orderDate, -- totalPrice, firstName, lastName, etc.
```

So we need to modify our `createOrderTable()` method to include not only a PK, but also a Secondary Key which will be order timestamp. Modify the method to be as follows: 

```js
  private createOrderTable() : ITable {
    const orderTable = new Table(this, 'order', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'orderDate',
        type: AttributeType.STRING
      },
      tableName: 'order',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return orderTable;
  }
```

-------

### 2. Now build the Ordering Lambda

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/954abfed-8e08-4a0b-86b6-bc497181856c">
</p>

1. Start by adding to the interfaces within the `lib/microservice.ts` file. Input the following update: 

```js
interface SwnMicroservicesProps {
    productTable: ITable
    basketTable: ITable
    orderTable: ITable
}
```

2. Update the public attributes of the class: 

```js
  public readonly productMicroservice: NodejsFunction
  public readonly basketMicroservice: NodejsFunction
  public readonly orderingMicroservice: NodejsFunction
```

3. Update the constructor with the props

```js
  constructor ( scope: Construct, id: string, props: SwnMicroservicesProps ){
      super(scope, id)
      this.productMicroservice = this.createProductFunction(props.productTable)
      this.basketMicroservice = this.createBasketFunction(props.basketTable)
      this.orderingMicroservice = this.createOrderingFunction(props.orderTable)
  }
```

4. Create the method `createOrderingFunction`

```js 
  private createOrderingFunction(orderTable: ITable ): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'userName',
        SORT_KEY: 'orderDate',
        DYNAMODB_TABLE_NAME: orderTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X
    }
    
    // Product microservices lambda function
    const orderFunction = new NodejsFunction(this, 'orderLambdaFunction', {
      entry: join(__dirname, `/../src/order/index.js`),
      ...nodeJsFunctionProps,
    })
    
    orderTable.grantReadWriteData(orderFunction)

    return orderFunction
  }
```

5. Now we need to go fix the interface changes in the `lib/aws-micorservices-stack.ts` files: 

```js
    const microservice = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable
    })
```

6. We still are not ready to fix the final eventbus reference to our `ordering` microservice yet. First go create the `src/order/index.js` file before we do this. 


-------

### 2. Create the Order Lambda operations 

1. Go to `/src/order/` and create a new file called `index.js`. In this file place the following boilerplate code: 

```js
exports.handler = async function(event) {
    console.log("request: ", JSON.stringify(event, undefined, 2))
    return {
        statusCode: 200,
        headers: {"Content-Type": "text/plain"},
        body: `Hello from Orderingn you've hit ${event.path}\n`
    }
}
```

2. Get the instructions from 189. 