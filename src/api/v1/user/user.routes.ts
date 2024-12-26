import { Router } from "express";

import * as userController from "./user.controller";
import validateQuery from "@/middleware/queryValidation.middleware";
import { userFilterSchema } from "./validationSchema";
import paginationValidationSchema from "@/common/paginationValidationSchema";

const userRoutes = Router();

userRoutes.get(
  "/",
  validateQuery(userFilterSchema),
  validateQuery(paginationValidationSchema),
  userController.getUsers
);
userRoutes.get("/me", userController.getCurrentUser);

export default userRoutes;
