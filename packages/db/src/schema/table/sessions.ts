import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { fieldCUDTimestamps } from "../core/schemaFields";

/**
 * # Session table
 * 用途：儲存用戶的 session 資訊。
 * @deprecated 目前將 session 資訊存儲在 cookies 中，此 table 暫時不使用。
 * */
export const tableSessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionToken: text("session_token").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => tableUsers.id, { onDelete: "cascade" }),
    expiredAt: timestamp("expired_at", { mode: "string" }).notNull(),
    ...fieldCUDTimestamps,
  },
  (table) => {
    return {
      userIdIndex: index("sessions_user_id_idx").on(table.userId),
      sessionTokenIndex: index("sessions_session_token_idx").on(table.sessionToken),
    };
  }
);

export const relationsSessions = relations(tableSessions, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableSessions.userId],
    references: [tableUsers.id],
  }),
}));

export const schemaSessionsInsert = createInsertSchema(tableSessions);
export const schemaSessionsSelect = createSelectSchema(tableSessions);
export type SessionsInsert = InferInsertModel<typeof tableSessions>;
export type SessionsSelect = InferSelectModel<typeof tableSessions>;
