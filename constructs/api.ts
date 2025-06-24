import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface ApiProps {
  envName: string;
  helloFunction: lambda.Function;
  createItemFn: lambda.Function;
  listItemsFn: lambda.Function;
  getItemFn: lambda.Function;
  updateItemFn: lambda.Function;
  deleteItemFn: lambda.Function;
}

export class Api extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    // API Gateway - ItemsApi
    this.api = new apigateway.RestApi(this, `ItemsApi-${props.envName}`, {
      restApiName: 'Items Service', // Name of the API Gateway
      deployOptions: {
        stageName: props.envName,
      },
    });

    // Hello Function - root - GET /
    this.api.root.addMethod("GET", new apigateway.LambdaIntegration(props.helloFunction));

    // Items Resource - /items
    const items = this.api.root.addResource('items');

    // Create Item Method - POST /items
    items.addMethod('POST', new apigateway.LambdaIntegration(props.createItemFn));

    // List Items Method - GET /items
    items.addMethod('GET', new apigateway.LambdaIntegration(props.listItemsFn));

    // Item Resource - /items/{id}
    const item = items.addResource('{id}');

    // Get Item Method - GET /items/{id}
    item.addMethod('GET', new apigateway.LambdaIntegration(props.getItemFn));

    // Update Item Method - PUT /items/{id}
    item.addMethod('PUT', new apigateway.LambdaIntegration(props.updateItemFn));

    // Delete Item Method - DELETE /items/{id}
    item.addMethod('DELETE', new apigateway.LambdaIntegration(props.deleteItemFn));
  }
}