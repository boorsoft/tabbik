import { RequestUser } from "../db/schema/user";
import { ApiError } from "../utils/apiError";
import { IPaginationMetadata } from "./response";

declare global {
  namespace Express {
    export interface Request {
      user?: RequestUser;
    }

    export interface Response {
      success<T>(data: T, message?: string): void;
      error(error: Error | ApiError, statusCode?: number): void;
      paginated<T>(
        data: T[],
        pagination: IPaginationMetadata,
        message: string
      ): void;
    }
  }
}

export {};
