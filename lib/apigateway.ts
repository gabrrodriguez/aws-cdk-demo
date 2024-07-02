import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnApiGatewayProps {
    productMicroservice: IFunction
    basketMicroservice: IFunction
}

export class SwnApiGateway extends Construct {

    constructor(scope: Construct, id: string, props: SwnApiGatewayProps ) {
        super(scope, id)

        this.createProductApi(props.productMicroservice)
        this.createBasketApi(props.basketMicroservice)
    }
    
    private createProductApi(productMicroservice: IFunction) {
        // Product microservices api gateway
        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName: 'ProductSerivce',
            handler: productMicroservice,
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

    private createBasketApi(basketMicroservice: IFunction) {
        // Basket microservices api gateway
        const apigw = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'BasketSerivce',
            handler: basketMicroservice,
            proxy: false
        });

        // root name = basket
        const basket = apigw.root.addResource('basket')

        // GET /basket
        basket.addMethod('GET')

        // POST /basket
        basket.addMethod('POST')

        // resource/name = /basket/{userName}
        const singleBasket = basket.addResource('{username}')

        // GET /basket/{userName}
        singleBasket.addMethod('GET')

        // DELETE /basket/{userName}
        singleBasket.addMethod('DELETE')

        // resource/name = /basket/checkout
        const basketCheckout = basket.addResource('checkout')

        // POST /basket/checkout
        basketCheckout.addMethod('POST')   // expected payload: {userName: swn}
    }
}