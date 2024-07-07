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

-------

### How it works

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