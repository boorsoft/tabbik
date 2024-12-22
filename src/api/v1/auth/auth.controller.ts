import { Request, Response } from "express";

import * as authService from "./auth.service";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const token = await authService.login(username, password);

  return res.success({ token }, "Authorization successful");
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await authService.signup(username, email, password);

  return res.success(user, "User signup successful");
};
