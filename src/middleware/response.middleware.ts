import { NextFunction, Request, Response } from "express";
import {
  IErrorResponse,
  IPaginatedResponse,
  IPaginationMetadata,
  ISuccessResponse,
} from "@/common/types/response";
import { ApiError } from "../common/utils/apiError";

const responseMiddleware = (
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
      data: data ?? null,
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

  res.error = (error: ApiError) => {
    const response: IErrorResponse = {
      success: false,
      error: error.message,
      data: null,
      statusCode: error.statusCode,
    };

    res.status(error.statusCode).json(response);
  };

  next();
};

export default responseMiddleware;
