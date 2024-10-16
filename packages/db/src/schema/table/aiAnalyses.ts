import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, jsonb, text, pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableJournalEntries } from "./journalEntries";
import { fieldCUDTimestamps } from "../core/schemaFields";

/**
 * # AI分析 table
 * 用途：存儲 AI 對日記內容的分析結果。
 * */
export const tableAIAnalyses = pgTable(
  "ai_analyses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    journalId: uuid("journal_id")
      .notNull()
      .references(() => tableJournalEntries.id, { onDelete: "cascade" }), // 關聯的日記ID
    emotionAnalysis: jsonb("emotion_analysis").default("{}"), // 情緒和思維分析結果
    reflection: text("reflection"), // 反思與建議
    ...fieldCUDTimestamps,
  },
  (table) => {
    return {
      journalIdIndex: index("ai_analyses_journal_id_idx").on(table.journalId),
    };
  }
);

export const relationsAIAnalyses = relations(tableAIAnalyses, ({ one }) => ({
  journalEntry: one(tableJournalEntries, {
    fields: [tableAIAnalyses.journalId],
    references: [tableJournalEntries.id],
  }),
}));

export const schemaAIAnalysesInsert = createInsertSchema(tableAIAnalyses);
export const schemaAIAnalysesSelect = createSelectSchema(tableAIAnalyses);
export type AIAnalysesInsert = InferInsertModel<typeof tableAIAnalyses>;
export type AIAnalysesSelect = InferSelectModel<typeof tableAIAnalyses>;
