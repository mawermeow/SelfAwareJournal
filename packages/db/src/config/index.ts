import "dotenv/config";

export default {
  db: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
  },
  admin: {
    secret: process.env.ADMIN_SECRET || "",
  },
};
