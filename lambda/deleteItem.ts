export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing "id" in path parameters' }),
      };
    }

    // Simulate deletion (DynamoDB will be connected later)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Item deleted successfully',
        id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};