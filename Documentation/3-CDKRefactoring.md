# AWS CDK Organization Best Practice

We have utilized AWS CDK to 1. Create the `AWSMicroservicesStack` and 2. Create the `product` microservice and its associated logic captured in our APIs. Before creating more AWS services we need to evaluate if the current construct (from a code organization) standpoint is the best way to utilize our files and dir architecture to create additional services like `basket` and `orders`. 

If you research a bit on best practice for organizing services and the files for building microservices you will find that the recommended approach is something similar to the article you find [here](https://aws.amazon.com/blogs/developer/recommended-aws-cdk-project-structure-for-python-applications/)

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/71ac46a1-2708-4938-ba0c-b745da210488">
</p>

> NOTE: This example refers to a python project where we are using NodeJs, but the construct for the project architecture remains the same. 

Essentially the recommendation is to utilize our code file construct and seperate resource logic along with the architectural layers. The construct can be visually depicted like this: 

<p align="center">
<img width="450" alt="image" src="https://github.com/gabrrodriguez/aws-cdk-demo/assets/126508932/8fbf5c50-2b35-4cc7-9b08-3b3f8c7d35a6">
</p>

