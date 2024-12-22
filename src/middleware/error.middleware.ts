import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

const errorMiddleware = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Error: ", err);
  }

  if (err instanceof ApiError) {
    res.error(err);
  } else {
    res.error(new ApiError("Internal server error", 500));
  }

  next();
};

export default errorMiddleware;
