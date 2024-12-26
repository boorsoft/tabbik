import { Router } from "express";

import * as userController from "./user.controller";

const userRoutes = Router();

userRoutes.get("/", userController.getUsers);
userRoutes.get("/me", userController.getCurrentUser);

export default userRoutes;
