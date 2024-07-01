import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnApiGatewayProps {
    productMicroservice: IFunction
}

export class SwnApiGateway extends Construct {
    constructor(scope: Construct, id: string, props: SwnApiGatewayProps ) {
        super(scope, id)

        // Product microservices api gateway
    const apigw = new LambdaRestApi(this, 'productApi', {
        restApiName: 'ProductSerivce',
        handler: props.productMicroservice,
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
}