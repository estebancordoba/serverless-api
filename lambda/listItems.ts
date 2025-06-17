export const handler = async (event: any) => {
  try {
    // Simulate list (DynamoDB will be connected later)
    const items = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' },
    ];

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Items retrieved successfully',
        items,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};