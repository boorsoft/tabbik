import { Router } from "express";
import { validateData } from "../../../middleware/validation.middleware";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "./validationSchema";

import * as authController from "./auth.controller";

export const auth = Router();

auth.post("/login", validateData(loginValidationSchema), authController.login);

auth.post(
  "/signup",
  validateData(signupValidationSchema),
  authController.signup
);
