import "dotenv/config";
import * as fs from "fs";

export default {
  db: {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "",
    user: process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PASSWORD || "",
    cert: process.env.NEXT_PUBLIC_PGSSLROOTCERT
      ? fs.readFileSync(process.env.NEXT_PUBLIC_PGSSLROOTCERT).toString()
      : process.env.PGSSLMODE === "require"
        ? fs.readFileSync(process.env.PGSSLROOTCERT || "").toString()
        : "",
  },
  admin: {
    secret: process.env.ADMIN_SECRET || "",
  },
};
