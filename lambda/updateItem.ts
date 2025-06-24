import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResponse, 
  UpdateItemRequest,
  UpdateItemResponse,
  Item 
} from "../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResponse> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing "id" parameter' }),
      };
    }

    const body: UpdateItemRequest = JSON.parse(event.body || '{}');

    if (!body || !body.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing "title" in request body' }),
      };
    }

    // First, check if the item exists
    const getResult = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    if (!getResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }

    // Update the item
    const updateResult = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET title = :title, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':title': body.title,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    const updatedItem: Item = updateResult.Attributes as Item;
    const response: UpdateItemResponse = {
      message: 'Item updated successfully',
      item: updatedItem
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error updating item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
