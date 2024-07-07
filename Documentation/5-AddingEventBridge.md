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