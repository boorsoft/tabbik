import { user } from "@/db/schema/user";

export type UserInsert = typeof user.$inferInsert;

export type UserSelect = typeof user.$inferSelect;
