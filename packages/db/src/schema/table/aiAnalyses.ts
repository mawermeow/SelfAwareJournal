import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, jsonb, text, pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableJournalEntries } from "./journalEntries";
import { fieldCUDTimestamps } from "../core/schemaFields";

export const tableAIAnalyses = pgTable(
  "ai_analyses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    journalId: uuid("journal_id")
      .notNull()
      .references(() => tableJournalEntries.id, { onDelete: "cascade" }),
    emotionAnalysis: jsonb("emotion_analysis").default("{}"),
    reflection: text("reflection"),
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
