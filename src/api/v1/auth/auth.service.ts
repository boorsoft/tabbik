import { ApiError } from "../../../common/utils/apiError";
import { createUser, getUserByUsername } from "../user/user.service";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../common/utils/jwt";
import { UserSelect } from "../user/types";

export async function login(username: string, password: string) {
  const user = await getUserByUsername(username);

  if (!user) throw new ApiError("User not found", 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError("Username or password is invalid", 400);

  const token = generateToken(user);

  return token;
}

export async function signup(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  isNovice: boolean = false
) {
  const user: UserSelect = await getUserByUsername(username);

  if (user) throw new ApiError("User already exists!", 400);

  const hash = await bcrypt.hash(password, 10);

  const newUser = await createUser({
    username,
    email,
    password: hash,
    firstName,
    lastName,
    isNovice,
  });

  return newUser;
}
