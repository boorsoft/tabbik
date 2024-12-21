import { tournament } from "../../../db/schema/tournament";

export type Tournament = typeof tournament.$inferInsert;
