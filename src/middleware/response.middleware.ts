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
  res.success = <T>(
    data: T,
    message: string = "Data fetched successfully!"
  ) => {
    const response: ISuccessResponse<T> = {
      success: true,
      data,
      message,
      error: null,
    };

    res.status(200).json(response);
  };

  res.paginated = <T>(
    data: T[],
    pagination: IPaginationMetadata,
    message: string = "Data fetched successfully!"
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
