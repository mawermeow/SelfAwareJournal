import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, varchar, pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { fieldCUDTimestamps } from "../core/schemaFields";

/**
 * # 用戶反饋 table
 * 用途：收集用戶對平台的反饋與建議。
 * */
export const tableFeedbacks = pgTable(
  "feedbacks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => tableUsers.id, { onDelete: "set null" }), // 關聯的用戶ID（可為NULL），外部引用使用者（id）刪除設定為空白
    feedbackType: varchar("feedback_type", { length: 50 }).notNull(), // 反饋類型（如功能建議、錯誤報告）
    message: text("message").notNull(), // 反饋內容
    ...fieldCUDTimestamps,
  },
  (table) => {
    return {
      userIdIndex: index("feedbacks_user_id_idx").on(table.userId),
    };
  }
);

export const relationsFeedbacks = relations(tableFeedbacks, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableFeedbacks.userId],
    references: [tableUsers.id],
  }),
}));

export const schemaFeedbacksInsert = createInsertSchema(tableFeedbacks);
export const schemaFeedbacksSelect = createSelectSchema(tableFeedbacks);
export type FeedbacksInsert = InferInsertModel<typeof tableFeedbacks>;
export type FeedbacksSelect = InferSelectModel<typeof tableFeedbacks>;
