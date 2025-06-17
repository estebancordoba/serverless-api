export const handler = async (event: any) => {
    try {
      const body = JSON.parse(event.body || '{}');

      if (!body || !body.title) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing "title" in request body' }),
        };
      }

      // Simulate creation (DynamoDB will be connected later)
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Item created successfully',
          item: { id: '123', title: body.title },
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };