export const handler = async () => {
  console.log("*** LOGGING FROM LAMBDA ***");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda!" }),
  };
};
