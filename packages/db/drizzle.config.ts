import { defineConfig } from "drizzle-kit";
import config from "./src/config";
import "dotenv/config";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migration",
  driver: "pg",
  dbCredentials: {
    host: config.db.host,
    port: config.db.port ? Number(config.db.port) : 5432,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
  },
});
