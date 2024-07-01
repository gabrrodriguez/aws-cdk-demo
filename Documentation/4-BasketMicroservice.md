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

### 1. Lambda build for `basket`

1. 
