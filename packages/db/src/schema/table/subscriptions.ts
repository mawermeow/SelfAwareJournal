import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable, date, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { fieldCUDTimestamps } from "../core/schemaFields";

/* 訂閱與計劃 ENUM */
export const subscriptionStatusPgEnum = pgEnum("subscriptions_status", [
  "active",
  "inactive",
  "canceled",
]);

/**
 * # 訂閱與計劃 table
 * 用途：管理用戶的訂閱資訊和計劃。
 * */
export const tableSubscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => tableUsers.id, { onDelete: "cascade" }),
    planName: text("plan_name").notNull(), // 計劃名稱（如 免費、專業）
    status: subscriptionStatusPgEnum("status").notNull(), // 訂閱狀態（如 active, inactive, canceled）
    startDate: date("start_date").notNull(), // 訂閱開始日期
    endDate: date("end_date"), // 訂閱結束日期
    ...fieldCUDTimestamps,
  },
  (table) => {
    return {
      userIdIndex: index("subscriptions_user_id_idx").on(table.userId),
      statusIndex: index("subscriptions_status_idx").on(table.status),
    };
  }
);

export const relationsSubscriptions = relations(tableSubscriptions, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableSubscriptions.userId],
    references: [tableUsers.id],
  }),
}));

export const schemaSubscriptionsInsert = createInsertSchema(tableSubscriptions);
export const schemaSubscriptionsSelect = createSelectSchema(tableSubscriptions);
export type SubscriptionsInsert = InferInsertModel<typeof tableSubscriptions>;
export type SubscriptionsSelect = InferSelectModel<typeof tableSubscriptions>;
