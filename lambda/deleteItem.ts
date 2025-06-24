import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing "id" in path parameters' }),
      };
    }

    try {
      // Use ConditionalExpression to verify that the item exists before deleting it
      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
        ConditionExpression: 'attribute_exists(id)'
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Item deleted successfully',
          id,
        }),
      };
    } catch (deleteError: any) {
      // If the error is ConditionalCheckFailedException, it means that the item did not exist
      if (deleteError.name === 'ConditionalCheckFailedException') {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Item not found',
            id,
          }),
        };
      }
      // If it's another error, we throw it so it's handled in the general catch
      throw deleteError;
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
