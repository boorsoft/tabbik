import { NextFunction, Request, Response } from "express";
import {
  IPaginatedResponse,
  IPaginationMetadata,
  ISuccessResponse,
} from "../types/response";

const responseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.success = <T>(data: T, message: string = "Success!") => {
    let statusCode = 200;

    if (req.method === "POST") {
      statusCode = 201;
    } else if (req.method === "DELETE") {
      statusCode = 204;
    }

    const response: ISuccessResponse<T> = {
      success: true,
      data,
      message,
      error: null,
    };

    res.status(statusCode).json(response);
  };

  res.paginated = <T>(
    data: T[],
    pagination: IPaginationMetadata,
    message: string = "Success!"
  ) => {
    const response: IPaginatedResponse<T> = {
      success: true,
      data,
      pagination,
      message,
      error: null,
    };

    res.status(200).json(response);
  };

  next();
};

export default responseMiddleware;
