import "dotenv/config";

export default {
  db: {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "",
    user: process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PASSWORD || "",
  },
  admin: {
    secret: process.env.ADMIN_SECRET || "",
  },
};
