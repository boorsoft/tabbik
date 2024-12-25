import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../common/utils/apiError";

import * as userService from "./user.service";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (!id) {
      next(new ApiError("User id not provided", 400));
      return;
    }

    const user = await userService.getUserById(+id);

    res.success(user);
  } catch (e) {
    next(e);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  try {
    if (!user) {
      next(new ApiError("Failed to fetch user data", 400));
      return;
    }

    const userData = await userService.getUserById(user.id);

    res.success(userData);
  } catch (e) {
    next(e);
  }
};
