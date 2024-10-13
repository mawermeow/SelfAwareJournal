import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "../core/schemaFields";
import { tableAccounts } from "@/schema/table/accounts";
import { tableTestResults } from "@/schema/table/testResults";
import { tableJournalEntries } from "@/schema/table/journalEntries";
import { tableFeedbacks } from "@/schema/table/feedbacks";
import { tableSubscriptions } from "@/schema/table/subscriptions";

export const tableUsers = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password"), // 密碼欄位（允許 NULL，OAuth 用戶無需密碼）
  emailVerified: timestamp("email_verified", { mode: "string" }), // 用於郵件驗證
  image: text("image"), // 用戶頭像
  ...fieldCUDTimestamps,
});

export const relationsUsers = relations(tableUsers, ({ many }) => ({
  accounts: many(tableAccounts),
  testResults: many(tableTestResults),
  journalEntries: many(tableJournalEntries),
  feedbacks: many(tableFeedbacks),
  subscriptions: many(tableSubscriptions),
}));

export const schemaUsersInsert = createInsertSchema(tableUsers);
export const schemaUsersSelect = createSelectSchema(tableUsers);
export type UsersInsert = InferInsertModel<typeof tableUsers>;
export type UsersSelect = InferSelectModel<typeof tableUsers>;
