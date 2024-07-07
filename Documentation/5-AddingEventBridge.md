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

### 1. Build the Infrastructure for EventBridge

1. 

