import { drizzle } from "drizzle-orm/node-postgres";
import { Config } from "../config/config";
import { Pool } from "pg";

import * as tournamentSchema from "./schema/tournament";
import * as userSchema from "./schema/user";

const pool = new Pool({
  connectionString: Config.databaseUrl,
});

export const db = drizzle(pool, {
  schema: { ...tournamentSchema, ...userSchema },
});
