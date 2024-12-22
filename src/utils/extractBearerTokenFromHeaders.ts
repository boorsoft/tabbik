import { IncomingHttpHeaders } from "http";
import { ApiError } from "./apiError";

const extractBearerTokenFromHeaders = ({
  authorization,
}: IncomingHttpHeaders) => {
  if (!authorization) {
    throw new ApiError("Authorization header is missing", 401);
  }

  if (!authorization.startsWith("Bearer")) {
    throw new ApiError("Authorization header is not in the Bearer scheme", 401);
  }

  return authorization.slice(7);
};

export default extractBearerTokenFromHeaders;
