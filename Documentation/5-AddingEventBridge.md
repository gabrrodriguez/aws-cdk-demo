# Adding EventBridge 

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/6142a422-4f20-4014-89db-e555893eb49f">
</p>

--------

## Background on EventBridge

### Invocation Types

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/6fa36ac5-7c56-4e64-a609-042420f3d78c">
</p>

#### Asynchronous Invocation
- [ ] Lambda _sends_ the _event_ to a _internal queue_ and return a _success response_ without any additional information. 
- [ ] Seperate process _reads events_ from the _queue_ and _runs_ our lambda function.
- [ ] _S3/SNS + Lambda + DynamoDB_
- [ ] _Invocation-type_ flag should be _"Event"_
- [ ] AWS Lambda sets a _retry policy_
    + Retry Count = 2 
    + Attach a Dead Letter Queue (DLQ) 
- [ ] Example of asynchronous invocation using the AWS CLI: 
    + aws lambda invoke - function-name MyLambdaFunction _-invocation-Type Event_ --payload '{"key":"value"}'
- [ ] Triggered _AWS Services_ of _asynchronous invocation_; S3, EventBridge, SNS, SES, CloudFormation, CloudWatch Logs, CloudWatch Events, Code Commit


<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/a3114256-291e-40a9-9e55-eb5120cb17bf">
</p>

> Reference: [EventBridge Message Structure](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html)

----------

### EventBridge General Flow

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/4730e21c-8e6c-4ae0-a669-c833133c39ee">
</p>

- [ ] Serverless Event Bus service for AWS Services
- [ ] Build event-driven applications at scale using events generated from your apps
- [ ] Use to connect your applications with data from a variety of sources, integrated SaaS applications
- [ ] AWS Services to targets such as AWS Lambda Functions
- [ ] Formerly called Amazon CloudWatch Events

#### How it works 

There are 4 primary components to understanding how `EventBridge` works: 
1. Event Sources
2. Event Bus
3. Rules
4. Targets

##### Event Sources 
> An `event` indicates a change in an environment such as an AWS Environment or SaaS Partner service. Events are represented as JSON objects and they all have a similar structure, and same top-level fields. Below is an example of the JSON object representing an `event`. Different services will emit different payload schemas, and the schema may change based on event activity (e.g. Created vs. Destroyed). A source of example payloads can be found [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html)

##### Buses
> An event `bus` is a pipeline that receives events. Rules associated with the event bus evaluate events as they arrive. A resource-based policy specifies which events to allow, and which entities have permission to create or modify rules or targets for an event. 

##### Rules
> A `rule` matches incoming `events` and sends them to targets for processing. A single rule can send an event to multiple targets, which then run in parallel. An event pattern defines the event structure and the fields that a rule matches. A rule often requires the use of IAM policies to ensure the roles and permissions to execute activtiy between resources can be carried out. 

##### Target
> A `target` is a resource or endpoint that EventBridge sends an event to when the event matches the event pattern defined for a rule. The rule processes the event data and sends the relevant information to the target. You can have up to 5 targets per rule. 

-------

### Other EventBridge Components

#### Event Bus

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/b51ae47c-c4e9-488f-baca-0bdf0bc52fd6">
</p>

> Reference: [Event Bridge](https://aws.amazon.com/eventbridge/?p=pm&c=ai&pd=eb&z=4)

#### Amazon Event Bridge Pipes

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/d7556cf6-e548-4074-ae52-4ad0b752756a">
</p>

> Reference: [Event Bridge Pipes](https://aws.amazon.com/eventbridge/pipes/)

#### Event Bridge Scheduler

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/46caf813-d74f-40c1-b133-9ae4d928f85c">
</p> 

> Reference: [Event Bridge Scheduler](https://aws.amazon.com/eventbridge/scheduler/)

---------

### What EventBridge Enables in our Design

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/83251686-0bc7-4040-977c-9759deb018fa">
</p>

- [ ] Up till this point we simply used Synchronous REST calls to invoke our Lambda functions. 
- [ ] Now we will be introducing a "pub/sub" or "listener" pattern with EventBridge, where a RESTful call will not be the trigger mechanism but rather `eventing` and `event listners` will execute automated responses vs. RESTful calls. 

-------

## Procedure

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/396346d0-9902-4acb-8dd3-235b9211a8f7">
</p>

### 1. Build the Infrastructure for EventBridge

1. First we need to build the CDK code the will provision the infrastructure for our Eventbridge instance. 

Nav to our `lib/aws-microservice-stack.ts` file and add the following code: 

```js
    // eventbus
    const bus = new EventBus(this, 'SwnEventBus', {
      eventBusName: 'SwnEventBus'
    })
```

Be sure to include the import 

```js
import { EventBus } from 'aws-cdk-lib/aws-events';
```

2. Now, within the same file we need to create an `EventBus Rule`. Input the following code: 

```js
    const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
      eventBus: bus,
      enabled: true,
      description: "When the Basket microservice checks out an order",
      eventPattern: {
        source: ['com.swn.basket.checkoutbasket'],
        detailType: ['CheckoutBasket']
      },
      ruleName: 'CheckoutBaseketRule'
    })
```

> NOTE: The most important component in the JSON structure above is the `eventPattern`. In our `event` the only way that EventBridge will know to trigger our Ordering Service call is it will be listening for a `source` and `detailType` that match exactly what we have above. If these do not match our `rule` and `event` then EventBridge will not know to do anything with our event.

You will also need to import `Rule`: 

```js
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
```

3. Now, within the same file you need to add the `target`. 

```js
    checkoutBasketRule.addTarget(new LambdaFunction(orderingMicroservice))
```

Our `orderingMicroservice` does not exist yet, so we will have to go create this. 

----- 

### 2. Refactor our eventbridge per AWS CDK Construct 

Recall for all our infra builds we create a file to segment our resources and then we manage these files via our `stack` (`aws-microservice-stack.ts`) file. We will repeat this process for our `eventbridge` resource. Therefore we will have to refactor our EventBus code a little. 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/d5265be1-1730-49a7-bb0b-cd6d8eddf603">
</p>


1. Create a new file called, `lib/eventbus.ts` and create a new EventBus construct. Call the constructor and input the following code: 

```js
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnEventBusProps {
    publishFunction: IFunction,
    targetFunction: IFunction
}
export class SwnEventBus extends Construct{
    constructor(scope: Construct, id: string, props: SwnEventBusProps) {
        super(scope, id)
    }
}
```

2. Now copy/paste our code in our `lib/aws-microservice-stack.ts` file to our `lib/eventbus.ts` file like this: 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/0c8747c3-bb36-4447-a790-1594ec4bb1e2">
</p>

Be sure to incorporate the import statements 

```js
import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
```

3. For our last change implement our interface `targetFunction` in place of our `orderingMicroservice` in our `/lib/eventbus.ts` file. 

```js
      checkoutBasketRule.addTarget(new LambdaFunction(props.targetFunction))
```

4. We need to grant IAM permissions to the EventBus to interface with our Lambda function. To do this you need to add the following line of code to the `eventbus.ts` file. 

```js
bus.grantPutEventsTo(props.publishFunction)
```

5. Now lets incorporate our `eventbus.ts` file back into our main tech stack file `lib/aws-microservices-stack.ts`. To do so update the `/aws-microservices-stack.ts` file as follows:

```js
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservices } from './microservices';
import { SwnApiGateway } from './apigateway';
import { SwnEventBus } from './eventbus';

export class AwsMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, 'Database')

    const microservice = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable
    })

    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservice.productMicroservice,
      basketMicroservice: microservice.basketMicroservice
    })

    const eventBus = new SwnEventBus(this, 'EventBus', {
      publishFunction: microservice.basketMicroservice,
      targetFunction: // microservice.orderMicroservice
    })
  }
}
```

> Note: We cannot reference our `targetFunction` yet, because this will be the `orderMicroservice` which we haven't created yet. For now we can leave a comment and fill in the reference when we create the order service. 

---------