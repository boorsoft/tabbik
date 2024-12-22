import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { IErrorResponse } from "../types/response";

const errorMiddleware = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Something went wrong";

  if (process.env.NODE_ENV !== "production") {
    console.error("Error: ", err);
  }

  const response: IErrorResponse = {
    success: false,
    statusCode,
    data: null,
    message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : "",
  };

  res.status(statusCode).json(response);

  next();
};

export default errorMiddleware;
