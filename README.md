# AWS Microservice Demo

## Architecture

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/fa8cd646-a241-4201-92a5-9f0261dd8d7c">
</p>

This is the architecture we will develop within this demo. This will be completed in a step by step format. 

-------

## Documentation 

In the `AWS-Microservices/Documentation` folder within this repo, you will find that I've itemized procedures to help with the build process. 

Just like the depiction of the architecture above there are several aspects of the build process. In this demo, I start by deploying the inital `AWSMicroservice` stack in CloudFormation, and then start with the `Product` Microservice. 

While many of the steps in this process are "repeatable" there are nuances and aspects of the build process that are better called out in an itemized iteration of instruction. Each `.md` file found in the `Documentation` directory is an attempt to logically break up the build process of the above architecture into steps to assist with design, build, troubleshooting, and deployment processes. 

### Content 

- [ ] 1. Initial Product Microservice Build
- [ ] 2. Product Microservice CRUD API Build
- [ ] 3. CDK Refactoring / Organizational Structure
- [ ] 4. Initial Basket Microservice Build
- [ ] 5. Adding EventBridge and Async communication

------

## Reference 

- [ ] [Amazon DynamoDB Docs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb-readme.html)
- [ ] [AWS CDK Documentation](https://github.com/gabrrodriguez/aws-cdk-dynamodb-table/tree/cdk-v2)
- [ ] [AWS CDK Getting Started](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)
- [ ] [AWS CDK Github Repo](https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib)