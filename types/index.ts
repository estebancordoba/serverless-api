// AWS Lambda Event Types
export interface APIGatewayProxyEvent {
  body: string | null;
  headers: { [name: string]: string | undefined };
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: { [name: string]: string | undefined } | null;
  queryStringParameters: { [name: string]: string | undefined } | null;
  requestContext: {
    accountId: string;
    apiId: string;
    httpMethod: string;
    identity: {
      accessKey: string | null;
      accountId: string | null;
      apiKey: string | null;
      apiKeyId: string | null;
      caller: string | null;
      cognitoAuthenticationProvider: string | null;
      cognitoAuthenticationType: string | null;
      cognitoIdentityId: string | null;
      cognitoIdentityPoolId: string | null;
      principalOrgId: string | null;
      sourceIp: string;
      user: string | null;
      userAgent: string | null;
      userArn: string | null;
    };
    path: string;
    protocol: string;
    requestId: string;
    requestTime: string;
    requestTimeEpoch: number;
    resourceId: string;
    resourcePath: string;
    stage: string;
  };
  resource: string;
  stageVariables: { [name: string]: string | undefined } | null;
}

// API Response Types
export interface APIGatewayProxyResponse {
  statusCode: number;
  headers?: { [header: string]: boolean | number | string };
  multiValueHeaders?: { [header: string]: (boolean | number | string)[] };
  body: string;
  isBase64Encoded?: boolean;
}

// Item Types
export interface Item {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemRequest {
  title: string;
}

export interface UpdateItemRequest {
  title: string;
}

// Error Types
export interface ErrorResponse {
  message: string;
  error?: string;
}

// Success Response Types
export interface CreateItemResponse {
  message: string;
  item: Item;
}

export interface GetItemResponse {
  item: Item;
}

export interface ListItemsResponse {
  items: Item[];
  count: number;
}

export interface UpdateItemResponse {
  message: string;
  item: Item;
}

export interface DeleteItemResponse {
  message: string;
}

// CloudFormation Resource Types for Testing
export interface CloudFormationResource {
  Type: string;
  Properties?: Record<string, unknown>;
}

export interface CloudFormationTemplate {
  Resources: Record<string, CloudFormationResource>;
}

export interface IAMPolicyStatement {
  Effect: string;
  Action: string[];
  Resource: string | string[];
}

export interface IAMPolicyDocument {
  Version: string;
  Statement: IAMPolicyStatement[];
}

export interface IAMPolicy {
  Properties: {
    PolicyDocument: IAMPolicyDocument;
    PolicyName: string;
    Roles: Array<{ Ref: string }>;
  };
  Type: string;
} 