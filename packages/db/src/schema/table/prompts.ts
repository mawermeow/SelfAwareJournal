import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "../core/schemaFields";

export const tablePrompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  ...fieldCUDTimestamps,
});

export const relationsPrompts = relations(tablePrompts, ({}) => ({}));

export const schemaPromptsInsert = createInsertSchema(tablePrompts);
export const schemaPromptsSelect = createSelectSchema(tablePrompts);
export type PromptsInsert = InferInsertModel<typeof tablePrompts>;
export type PromptsSelect = InferSelectModel<typeof tablePrompts>;
