import { NextFunction, Request, Response } from "express";

import * as authService from "./auth.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const token = await authService.login(username, password);

    return res.success({ token }, "Authorization successful");
  } catch (e) {
    next(e);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, firstName, lastName, isNovice } = req.body;

  try {
    const user = await authService.signup(
      username,
      email,
      password,
      firstName,
      lastName,
      isNovice
    );

    return res.success(user, "User signup successful");
  } catch (e) {
    next(e);
  }
};
