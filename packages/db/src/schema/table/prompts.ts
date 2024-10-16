import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "../core/schemaFields";

/**
 * # 引導提示 table
 * 用途：存儲不同類型的引導提示，用於引導用戶思考或日記寫作。
 * */
export const tablePrompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(), // 提示類型（如 引導思考、情緒分析）
  content: text("content").notNull(), // 提示內容
  ...fieldCUDTimestamps,
});

export const relationsPrompts = relations(tablePrompts, ({}) => ({}));

export const schemaPromptsInsert = createInsertSchema(tablePrompts);
export const schemaPromptsSelect = createSelectSchema(tablePrompts);
export type PromptsInsert = InferInsertModel<typeof tablePrompts>;
export type PromptsSelect = InferSelectModel<typeof tablePrompts>;
