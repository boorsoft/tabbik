import extractBearerTokenFromHeaders from "../utils/extractBearerTokenFromHeaders";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import errorMiddleware from "./error.middleware";
import { verifyToken } from "../utils/jwt";
import { RequestUser } from "../db/schema/user";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerTokenFromHeaders(req.headers);

    if (!token) throw new ApiError("Not authorized", 401);

    const jwtData = verifyToken(token);
    req.user = jwtData as RequestUser;

    next();
  } catch (e) {
    errorMiddleware(e as Error, req, res, next);
  }
};
