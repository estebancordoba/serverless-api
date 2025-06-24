import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResponse, 
  GetItemResponse,
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

    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }

    const item: Item = result.Item as Item;
    const response: GetItemResponse = { item };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error getting item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
