import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
    try {
      const body = JSON.parse(event.body || '{}');

      if (!body || !body.title) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing "title" in request body' }),
        };
      }

      const newItem = { id: uuidv4(), title: body.title };

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: newItem
      }));

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Item created successfully',
          item: newItem
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };