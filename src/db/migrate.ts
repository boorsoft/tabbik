import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

async function main() {
  console.log("Migration started...");

  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migration successful!");

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(0);
});
