import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Database } from "../constructs/database";
import { Functions } from "../constructs/functions";
import { Api } from "../constructs/api";

export class ServerlessApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get the environment name from the context
    const envName = this.node.tryGetContext('env') || 'dev';

    // Create the database
    const database = new Database(this, 'Database', {
      envName,
    });

    // Create the functions
    const functions = new Functions(this, 'Functions', {
      envName,
      table: database.table,
    });

    // Create the API
    new Api(this, 'Api', {
      envName,
      helloFunction: functions.helloFunction,
      createItemFn: functions.createItemFn,
      listItemsFn: functions.listItemsFn,
      getItemFn: functions.getItemFn,
      updateItemFn: functions.updateItemFn,
      deleteItemFn: functions.deleteItemFn,
    });
  }
}
