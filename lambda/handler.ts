import {
  APIGatewayEventRequestContext,
  APIGatewayProxyResult,
} from "aws-lambda";

exports.handler = async (
  event: APIGatewayEventRequestContext
): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event, undefined, 2));

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(event, undefined, 2),
  };
};
