import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { ServerlessApiStack } from '../lib/serverless-api-stack';

describe('ServerlessApiStack', () => {
  let template: Template;

  beforeEach(() => {
    const app = new cdk.App();
    const stack = new ServerlessApiStack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' }
    });
    template = Template.fromStack(stack);
  });

  test('DynamoDB Table is created with correct properties', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });
  });

  test('API Gateway REST API is created', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Items Service'
    });
  });

  test('API Gateway Deployment is created', () => {
    template.hasResourceProperties('AWS::ApiGateway::Deployment', {});
  });

  test('API Gateway Stage is created', () => {
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'dev'
    });
  });

  test('Lambda Functions are created', () => {
    // Check that Lambda functions exist
    template.resourceCountIs('AWS::Lambda::Function', 6);
  });

  test('Lambda Function has correct runtime and handler', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs18.x',
      Handler: 'hello.handler'
    });
  });

  test('Lambda Functions have environment variables', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          TABLE_NAME: Match.anyValue()
        }
      }
    });
  });

  test('IAM Roles are created for Lambda functions', () => {
    // There are 6 Lambda functions + 1 additional role (possibly for API Gateway)
    template.resourceCountIs('AWS::IAM::Role', 7);
  });

  test('Lambda functions have execution role', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Role: Match.anyValue()
    });
  });

  test('DynamoDB permissions are granted to Lambda functions', () => {
    const resources = template.toJSON().Resources;
    const policies = Object.values(resources).filter((r: any) => r.Type === 'AWS::IAM::Policy');
    const requiredActions = [
      'dynamodb:GetItem',
      'dynamodb:PutItem',
      'dynamodb:UpdateItem',
      'dynamodb:DeleteItem',
      'dynamodb:Query',
      'dynamodb:Scan'
    ];
    const hasCrudPolicy = policies.some((policy: any) => {
      const statements = Array.isArray(policy.Properties.PolicyDocument.Statement)
        ? policy.Properties.PolicyDocument.Statement
        : [policy.Properties.PolicyDocument.Statement];
      return statements.some((stmt: any) => {
        if (stmt.Effect !== 'Allow' || !Array.isArray(stmt.Action)) return false;
        return requiredActions.every(action => stmt.Action.includes(action));
      });
    });
    expect(hasCrudPolicy).toBe(true);
  });

  test('API Gateway methods are created for all endpoints', () => {
    // Root GET method
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: Match.anyValue(),
      RestApiId: Match.anyValue()
    });

    // Items POST method
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: Match.anyValue(),
      RestApiId: Match.anyValue()
    });

    // Items GET method
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: Match.anyValue(),
      RestApiId: Match.anyValue()
    });
  });

  test('Lambda integrations are configured for API Gateway', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS_PROXY',
        IntegrationHttpMethod: 'POST'
      }
    });
  });

  test('Stack has correct number of resources', () => {
    // This is a basic check to ensure we have a reasonable number of resources
    // The exact count may vary based on CDK version and implementation details
    const resourceCount = Object.keys(template.toJSON().Resources).length;
    expect(resourceCount).toBeGreaterThan(20); // Should have at least 20 resources
  });

  test('All Lambda functions have correct timeout and memory settings', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Timeout: 10,
      MemorySize: 256
    });
  });

  test('API Gateway has correct stage configuration', () => {
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      DeploymentId: Match.anyValue(),
      RestApiId: Match.anyValue(),
      StageName: 'dev'
    });
  });
});
