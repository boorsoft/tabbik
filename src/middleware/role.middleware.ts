import { NextFunction, Request, Response } from "express";
import { ApiError } from "../common/utils/apiError";
import { Role } from "@/common/types/role";

export default function roleMiddleware(roles?: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (roles) {
      if (roles.includes(userRole) || userRole === "ADMIN") {
        next();
        return;
      }

      next(new ApiError("You don't have access to this resource.", 403));

      return;
    }

    next();
  };
}
