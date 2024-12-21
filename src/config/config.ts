import dotenv from "dotenv";

dotenv.config();

export class Config {
  static databaseUrl = process.env.DATABASE_URL!;
  static pgHost = process.env.PGHOST!;
  static pgDatabase = process.env.PGDATABASE!;
  static pgUser = process.env.PGUSER!;
  static pgPassword = process.env.PGPASSWORD!;
  static secretKey = process.env.SECRET_KEY!;
}
