import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "../core/schemaFields";
import { tableTestResults } from "./testResults";

/**
 * # 性格測驗 table
 * 用途：存儲不同類型的性格測驗資訊。
 * */
export const tablePersonalityTests = pgTable("personality_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // 測驗名稱（如 MBTI）
  description: text("description").default(""), // 測驗描述
  ...fieldCUDTimestamps,
});

export const relationsPersonalityTests = relations(tablePersonalityTests, ({ many }) => ({
  testResults: many(tableTestResults),
}));

export const schemaPersonalityTestsInsert = createInsertSchema(tablePersonalityTests);
export const schemaPersonalityTestsSelect = createSelectSchema(tablePersonalityTests);
export type PersonalityTestsInsert = InferInsertModel<typeof tablePersonalityTests>;
export type PersonalityTestsSelect = InferSelectModel<typeof tablePersonalityTests>;
