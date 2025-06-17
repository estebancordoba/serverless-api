import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class ServerlessApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Hello Function
    const helloFunction = new lambda.Function(this, "HelloFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    // Create Item Function
    const createItemFn = new lambda.Function(this, 'CreateItemFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'createItem.handler',
    });

    // List Items Function
    // Creates a new Lambda function for listing items
    const listItemsFn = new lambda.Function(this, 'ListItemsFunction', {
      // Specifies Node.js 18.x as the runtime environment
      runtime: lambda.Runtime.NODEJS_18_X,
      // Loads the function code from the lambda directory
      code: lambda.Code.fromAsset('lambda'),
      // Points to the handler function in listItems.ts
      handler: 'listItems.handler',
    });

    // Get Item Function
    const getItemFn = new lambda.Function(this, 'GetItemFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getItem.handler',
    });

    // Update Item Function
    const updateItemFn = new lambda.Function(this, 'UpdateItemFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'updateItem.handler',
    });

    // Delete Item Function
    const deleteItemFn = new lambda.Function(this, 'DeleteItemFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'deleteItem.handler',
    });

    // API Gateway - ItemsApi
    const api = new apigateway.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service', // Name of the API Gateway
    });

    // Hello Function - root - GET /
    // Adds a GET method to the root resource
    api.root.addMethod("GET", new apigateway.LambdaIntegration(helloFunction));

    // Items Resource - /items
    // Adds the items resource to the root resource
    const items = api.root.addResource('items');

    // Create Item Method - POST /items
    // Adds a POST method to the items resource
    items.addMethod('POST', new apigateway.LambdaIntegration(createItemFn));

    // List Items Method - GET /items
    items.addMethod('GET', new apigateway.LambdaIntegration(listItemsFn));

    // Item Resource - /items/{id}
    // Adds a resource for individual items
    const item = items.addResource('{id}');

    // Get Item Method - GET /items/{id}
    // Adds a GET method to the item resource
    item.addMethod('GET', new apigateway.LambdaIntegration(getItemFn));

    // Update Item Method - PUT /items/{id}
    item.addMethod('PUT', new apigateway.LambdaIntegration(updateItemFn));

    // Delete Item Method - DELETE /items/{id}
    item.addMethod('DELETE', new apigateway.LambdaIntegration(deleteItemFn));
  }
}
