import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const motion = pgTable("motion", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAT: timestamp("updatedAt").defaultNow().notNull(),
});
