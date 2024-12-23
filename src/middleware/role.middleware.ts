import { NextFunction, Request, Response } from "express";
import { Role } from "../types/role";
import { ApiError } from "../utils/apiError";

export default function roleMiddleware(roles?: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (roles) {
      if (roles.includes(userRole) || userRole === "ADMIN") {
        next();
      }

      next(new ApiError("You don't have access to this resource.", 403));
    }

    next();
  };
}
