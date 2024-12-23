import { InferSelectModel } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("userRole", ["ADMIN", "USER", "MODERATOR"]);

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 40 }).unique().notNull(),
  email: varchar("email", { length: 200 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  avatar: varchar("avatar", { length: 256 }),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  role: userRole("userRole").default("USER").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAT: timestamp("updatedAt").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof user>;

export type RequestUser = Omit<User, "password">;
