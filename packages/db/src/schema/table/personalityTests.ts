import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "../core/schemaFields";
import { tableTestResults } from "@/schema/table/testResults";

export const tablePersonalityTests = pgTable("personality_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description").default(""),
  ...fieldCUDTimestamps,
});

export const relationsPersonalityTests = relations(tablePersonalityTests, ({ many }) => ({
  testResults: many(tableTestResults),
}));

export const schemaPersonalityTestsInsert = createInsertSchema(tablePersonalityTests);
export const schemaPersonalityTestsSelect = createSelectSchema(tablePersonalityTests);
export type PersonalityTestsInsert = InferInsertModel<typeof tablePersonalityTests>;
export type PersonalityTestsSelect = InferSelectModel<typeof tablePersonalityTests>;
