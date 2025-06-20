import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ServerlessApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DYNAMODB
    // Creates a new DynamoDB table for items
    const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const functionParams = {
      // Specifies Node.js 18.x as the runtime environment
      runtime: lambda.Runtime.NODEJS_18_X,
      // Loads the function code from the lambda directory
      code: lambda.Code.fromAsset('lambda'),
      // Defines the environment variables
      environment: {
        TABLE_NAME: table.tableName,
      },
    };

    // LAMBDA FUNCTIONS
    // Hello Function
    const helloFunction = new lambda.Function(this, "HelloFunction", {
      handler: "hello.handler",
      ...functionParams,
    });

    // Create Item Function
    const createItemFn = new lambda.Function(this, 'CreateItemFunction', {
      handler: 'createItem.handler',
      ...functionParams,
    });

    // List Items Function
    // Creates a new Lambda function for listing items
    const listItemsFn = new lambda.Function(this, 'ListItemsFunction', {
      // Points to the handler function in listItems.ts
      handler: 'listItems.handler',
      ...functionParams,
    });

    // Get Item Function
    const getItemFn = new lambda.Function(this, 'GetItemFunction', {
      handler: 'getItem.handler',
      ...functionParams,
    });

    // Update Item Function
    const updateItemFn = new lambda.Function(this, 'UpdateItemFunction', {
      handler: 'updateItem.handler',
      ...functionParams,
    });

    // Delete Item Function
    const deleteItemFn = new lambda.Function(this, 'DeleteItemFunction', {
      handler: 'deleteItem.handler',
      ...functionParams,
    });

    // IAM - FUNCTIONS
    // Grant permissions to the functions
    table.grantReadWriteData(createItemFn);
    table.grantReadWriteData(updateItemFn);
    table.grantReadWriteData(deleteItemFn);
    table.grantReadData(getItemFn);
    table.grantReadData(listItemsFn);

    // API GATEWAY
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
