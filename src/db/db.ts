import { drizzle } from "drizzle-orm/node-postgres";
import { Config } from "../config/config";
import { Client } from "pg";

import * as tournamentSchema from "./schema/tournament";
import * as userSchema from "./schema/user";

const sql = new Client(Config.databaseUrl);

export const db = drizzle(sql, {
  schema: { ...tournamentSchema, ...userSchema },
});
