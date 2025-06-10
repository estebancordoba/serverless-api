import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class ServerlessApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Function
    const helloFunction = new lambda.Function(this, "HelloFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "HelloApi", {
      restApiName: "Hello Service",
    });

    api.root.addMethod("GET", new apigateway.LambdaIntegration(helloFunction));
  }
}
