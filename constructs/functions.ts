import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface FunctionsProps {
  envName: string;
  table: dynamodb.Table;
}

export class Functions extends Construct {
  public readonly helloFunction: lambda.Function;
  public readonly createItemFn: lambda.Function;
  public readonly listItemsFn: lambda.Function;
  public readonly getItemFn: lambda.Function;
  public readonly updateItemFn: lambda.Function;
  public readonly deleteItemFn: lambda.Function;

  constructor(scope: Construct, id: string, props: FunctionsProps) {
    super(scope, id);

    const functionParams = {
      // Specifies Node.js 18.x as the runtime environment
      runtime: lambda.Runtime.NODEJS_18_X,
      // Loads the function code from the dist/lambda-bundled directory (bundled with esbuild)
      code: lambda.Code.fromAsset('dist/lambda-bundled'),
      // Defines the environment variables
      environment: {
        TABLE_NAME: props.table.tableName,
      },
      // Recommended memory size for simple functions
      memorySize: 256,
      // Avoid unexpected timeouts
      timeout: cdk.Duration.seconds(10),
    };

    // Hello Function
    this.helloFunction = new lambda.Function(this, `HelloFunction-${props.envName}`, {
      handler: "hello.handler",
      ...functionParams,
    });

    // Create Item Function
    this.createItemFn = new lambda.Function(this, `CreateItemFunction-${props.envName}`, {
      handler: 'createItem.handler',
      ...functionParams,
    });

    // List Items Function
    this.listItemsFn = new lambda.Function(this, `ListItemsFunction-${props.envName}`, {
      handler: 'listItems.handler',
      ...functionParams,
    });

    // Get Item Function
    this.getItemFn = new lambda.Function(this, `GetItemFunction-${props.envName}`, {
      handler: 'getItem.handler',
      ...functionParams,
    });

    // Update Item Function
    this.updateItemFn = new lambda.Function(this, `UpdateItemFunction-${props.envName}`, {
      handler: 'updateItem.handler',
      ...functionParams,
    });

    // Delete Item Function
    this.deleteItemFn = new lambda.Function(this, `DeleteItemFunction-${props.envName}`, {
      handler: 'deleteItem.handler',
      ...functionParams,
    });

    // Grant permissions to the functions
    props.table.grantReadWriteData(this.createItemFn);
    props.table.grantReadWriteData(this.updateItemFn);
    props.table.grantReadWriteData(this.deleteItemFn);
    props.table.grantReadData(this.getItemFn);
    props.table.grantReadData(this.listItemsFn);
  }
}
