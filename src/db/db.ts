import { drizzle } from "drizzle-orm/node-postgres";
import { Config } from "../common/config";
import { Pool } from "pg";

import * as tournamentSchema from "./schema/tournament";
import * as userSchema from "./schema/user";
import * as motionSchema from "./schema/motion";

const pool = new Pool({
  connectionString: Config.databaseUrl,
});

export const db = drizzle(pool, {
  schema: { ...tournamentSchema, ...userSchema, ...motionSchema },
});
