import { user, userRole } from "../../../db/schema/user";

export type UserInsert = typeof user.$inferInsert;

export type UserSelect = typeof user.$inferSelect;

export type UserRole = typeof userRole;
