import { timestamp } from "drizzle-orm/pg-core";

export const fieldCUDTimestamps = {
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
};
