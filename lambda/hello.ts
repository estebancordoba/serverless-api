import { APIGatewayProxyEvent, APIGatewayProxyResponse } from "../types";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResponse> => {
  console.log("*** LOGGING FROM LAMBDA ***");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda!" }),
  };
};
