import { eq } from "drizzle-orm";
import { db } from "../../../db/db";
import { user } from "../../../db/schema/user";
import { UserInsert } from "./types";

export async function createUser(userData: UserInsert) {
  const data = await db
    .insert(user)
    .values(userData)
    .returning({ id: user.id, username: user.username, email: user.email });

  return data[0];
}

export async function getUserByUsername(username: string) {
  const data = await db.select().from(user).where(eq(user.username, username));

  return data[0];
}
