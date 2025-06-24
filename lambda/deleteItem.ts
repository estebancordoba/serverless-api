import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResponse, 
  DeleteItemResponse 
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

    // Delete the item
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    const response: DeleteItemResponse = {
      message: 'Item deleted successfully'
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error deleting item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};