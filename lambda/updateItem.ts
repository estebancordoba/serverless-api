import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id;
    const body = JSON.parse(event.body || '{}');

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing "id" in path parameters' }),
      };
    }

    if (!body || !body.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing "title" in request body' }),
      };
    }

    try {
      // Use ConditionalExpression to verify that the item exists before updating it
      await docClient.update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET title = :title',
        ExpressionAttributeValues: { ':title': body.title },
        ConditionExpression: 'attribute_exists(id)'
      }).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Item updated successfully',
          id,
        }),
      };
    } catch (updateError: any) {
      // If the error is ConditionalCheckFailedException, it means that the item did not exist
      if (updateError.code === 'ConditionalCheckFailedException') {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Item not found',
            id,
          }),
        };
      }
      // If it's another error, we throw it so it's handled in the general catch
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};