import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "../core/schemaFields";
import { tableAccounts } from "./accounts";
import { tableTestResults } from "./testResults";
import { tableJournalEntries } from "./journalEntries";
import { tableFeedbacks } from "./feedbacks";
import { tableSubscriptions } from "./subscriptions";

export const userRolePgEnum = pgEnum("user_role", ["user", "admin"]);

/**
 * # 用戶 table
 * 用途：存儲用戶的基本資訊和帳戶設定。
 * */
export const tableUsers = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password"), // 密碼欄位（允許 NULL，OAuth 用戶無需密碼）
  emailVerified: timestamp("email_verified", { mode: "string" }), // 用於郵件驗證
  image: text("image"), // 用戶頭像
  role: userRolePgEnum("role").default("user").notNull(),
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
