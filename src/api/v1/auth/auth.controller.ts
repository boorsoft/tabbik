import { Request, Response, Router } from "express";
import { login, signup } from "./auth.service";
import { validateData } from "../../../middleware/validation.middleware";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "./validationSchema";

export const auth = Router();

auth.post(
  "/login",
  validateData(loginValidationSchema),
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    return login(username, password);
  }
);

auth.post(
  "/signup",
  validateData(signupValidationSchema),
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    return signup(username, email, password);
  }
);
