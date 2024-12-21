import { RequestUser } from "../db/schema/user";

declare global {
  namespace Express {
    export interface Request {
      user?: RequestUser;
    }
  }
}

export {};
