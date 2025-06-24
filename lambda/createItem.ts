import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResponse,
  CreateItemRequest,
  CreateItemResponse,
  Item
} from "../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResponse> => {
    try {
      const body: CreateItemRequest = JSON.parse(event.body || '{}');

      if (!body || !body.title) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing "title" in request body' }),
        };
      }

      const newItem: Item = {
        id: uuidv4(),
        title: body.title,
        createdAt: new Date().toISOString()
      };

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: newItem
      }));

      const response: CreateItemResponse = {
        message: 'Item created successfully',
        item: newItem
      };

      return {
        statusCode: 201,
        body: JSON.stringify(response),
      };
    } catch (error) {
      console.error('Error creating item:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };