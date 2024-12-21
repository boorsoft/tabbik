import { eq } from "drizzle-orm";
import { db } from "../../../db/db";
import { user } from "../../../db/schema/user";
import { UserInsert } from "./types";

export async function createUser(userData: UserInsert) {
  return db.insert(user).values(userData).returning();
}

export async function getUserByUsername(username: string) {
  return db.query.user.findFirst({ where: eq(user.username, username) });
}
