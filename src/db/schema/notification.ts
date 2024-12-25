import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const notification = pgTable("notification", {
  id: serial("id").primaryKey(),
  message: varchar("message", { length: 256 }).notNull(),
  data: json("data"),
  type: varchar("type", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notificationRecipient = pgTable("notificationRecipient", {
  id: serial("id").primaryKey(),
  notificationId: integer("notificationId").references(() => notification.id, {
    onDelete: "cascade",
  }),
  roomId: varchar("roomId", { length: 255 }),
  isViewed: boolean("isViewed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notificationRelations = relations(notification, ({ many }) => ({
  notificationRecipients: many(notificationRecipient),
}));
