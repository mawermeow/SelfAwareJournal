import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { fieldCUDTimestamps } from "../core/schemaFields";

export const tableAccounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => tableUsers.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 如 'oauth', 'credentials'
    provider: text("provider").notNull(), // 如 'google', 'line', 'credentials'
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: timestamp("expires_at", { mode: "string" }),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
    ...fieldCUDTimestamps,
  },
  (table) => {
    return {
      userIdIndex: index("accounts_user_id_idx").on(table.userId),
      providerAccountIdIndex: index("accounts_provider_account_id_idx").on(table.providerAccountId),
    };
  }
);

export const relationsAccounts = relations(tableAccounts, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableAccounts.userId],
    references: [tableUsers.id],
  }),
}));

export const schemaAccountsInsert = createInsertSchema(tableAccounts);
export const schemaAccountsSelect = createSelectSchema(tableAccounts);
export type AccountsInsert = InferInsertModel<typeof tableAccounts>;
export type AccountsSelect = InferSelectModel<typeof tableAccounts>;
