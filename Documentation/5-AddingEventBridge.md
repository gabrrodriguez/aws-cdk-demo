# Adding EventBridge 

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/6142a422-4f20-4014-89db-e555893eb49f">
</p>

--------

## Procedure

### CDK Infrastructure build for EventBridge Resources

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

### Event Bridge

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

```js
// AWS S3 Object Created Event logged in EventBridge
{
  "version": "0",
  "id": "17793124-05d4-b198-2fde-7ededc63b103",
  "detail-type": "Object Created",
  "source": "aws.s3",
  "account": "111122223333",
  "time": "2021-11-12T00:00:00Z",
  "region": "ca-central-1",
  "resources": [
    "arn:aws:s3:::DOC-EXAMPLE-BUCKET1"
  ],
  "detail": {
    "version": "0",
    "bucket": {
      "name": "DOC-EXAMPLE-BUCKET1"
    },
    "object": {
      "key": "example-key",
      "size": 5,
      "etag": "b1946ac92492d2347c6235b4d2611184",
      "version-id": "IYV3p45BT0ac8hjHg1houSdS1a.Mro8e",
      "sequencer": "617f08299329d189"
    },
    "request-id": "N4N7GDK58NMKJ12R",
    "requester": "123456789012",
    "source-ip-address": "1.2.3.4",
    "reason": "PutObject"
  }
}  
```

##### Buses
> An event `bus` is a pipeline that receives events. Rules associated with the event bus evaluate events as they arrive. A resource-based policy specifies which events to allow, and which entities have permission to create or modify rules or targets for an event. 

##### Rules
> A `rule` matches incoming `events` and sends them to targets for processing. A single rule can send an event to multiple targets, which then run in parallel. An event pattern defines the event structure and the fields that a rule matches. A rule often requires the use of IAM policies to ensure the roles and permissions to execute activtiy between resources can be carried out. 

##### Target
> A `target` is a resource or endpoint that EventBridge sends an event to when the event matches the event pattern defined for a rule. The rule processes the event data and sends the relevant information to the target. You can have up to 5 targets per rule. 

-------

### Event Bridge Components

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