import { defineConfig } from "drizzle-kit";
import { Config } from "../common/config";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    user: Config.pgUser,
    password: Config.pgPassword,
    database: Config.pgDatabase,
    host: Config.pgHost,
    port: Config.pgPort,
  },
});
