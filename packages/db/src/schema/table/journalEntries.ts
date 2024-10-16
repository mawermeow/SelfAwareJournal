import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, integer, varchar, pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { fieldCUDTimestamps } from "../core/schemaFields";
import { tableAIAnalyses } from "./aiAnalyses";

/**
 * # 日記條目 table
 * 用途：存儲用戶的意識流日記內容。
 * */
export const tableJournalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => tableUsers.id, { onDelete: "cascade" }),
    content: text("content").notNull(), // 日記內容
    emotion_score: integer("emotion_score"), // 情緒評分（例如1-10）
    mood: varchar("mood", { length: 50 }), // 心情描述
    ...fieldCUDTimestamps,
  },
  (table) => {
    return {
      userIdIndex: index("journal_entries_user_id_idx").on(table.userId),
    };
  }
);

export const relationsJournalEntries = relations(tableJournalEntries, ({ one, many }) => ({
  user: one(tableUsers, {
    fields: [tableJournalEntries.userId],
    references: [tableUsers.id],
  }),
  aiAnalyses: many(tableAIAnalyses),
}));

export const schemaJournalEntriesInsert = createInsertSchema(tableJournalEntries);
export const schemaJournalEntriesSelect = createSelectSchema(tableJournalEntries);
export type JournalEntriesInsert = InferInsertModel<typeof tableJournalEntries>;
export type JournalEntriesSelect = InferSelectModel<typeof tableJournalEntries>;
