import { Router } from "express";
import { validateData } from "../../../middleware/validation.middleware";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "./validationSchema";

import * as authController from "./auth.controller";

export const auth = Router();

// @openapi
// /example:
//   post:
//         tags:
//           - auth
//         summary: Login a user
//         requestBody:
//           description: Login
//           required: true
//           content:
//             application/json:
//               schema:
//                 $ref: '#/components/schemas/Login'
//         responses:
//           '200':
//             description: Login success response
//             content:
//               application/json:
//                 example:
//                   success: true
//                   message: "Authorization successful"
//                   data:
//                     token: "tokenstring"
//                   error: null
auth.post("/login", validateData(loginValidationSchema), authController.login);

auth.post(
  "/signup",
  validateData(signupValidationSchema),
  authController.signup
);
