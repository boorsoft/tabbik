export interface ISuccessResponse<T> {
  success: true;
  data: T | null;
  message: string;
  error: null;
}

export interface IErrorResponse {
  success: false;
  data: null;
  error: string;
  statusCode: number;
  stack?: string;
}

export interface IPaginationMetadata {
  page: number;
  size: number;
  totalData: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: IPaginationMetadata;
  message: string;
  error: null;
}
