import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResponse, 
  ListItemsResponse,
  Item 
} from "../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResponse> => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

    const items: Item[] = (result.Items || []) as Item[];
    const response: ListItemsResponse = {
      items,
      count: items.length
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error listing items:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
