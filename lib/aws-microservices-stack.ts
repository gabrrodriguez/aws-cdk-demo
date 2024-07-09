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
      basketTable: database.basketTable,
      orderTable: database.orderTable
    })

    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservice.productMicroservice,
      basketMicroservice: microservice.basketMicroservice,
      orderingMicroservice: microservice.orderingMicroservice
    })

    const eventBus = new SwnEventBus(this, 'EventBus', {
      publishFunction: microservice.basketMicroservice,
      targetFunction: microservice.orderingMicroservice
    })
  }
}