import jwt from "jsonwebtoken";
import { Config } from "../config/config";
import { RequestUser } from "../db/schema/user";

export const generateToken = (userData: RequestUser): string => {
  return jwt.sign(userData, Config.secretKey, { expiresIn: "28d" });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, Config.secretKey);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
