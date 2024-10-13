import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, jsonb, pgTable, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { tablePersonalityTests } from "./personalityTests";

export const tableTestResults = pgTable(
  "test_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => tableUsers.id, { onDelete: "cascade" }),
    testId: uuid("test_id")
      .notNull()
      .references(() => tablePersonalityTests.id, { onDelete: "cascade" }),
    result: text("result").notNull(),
    details: jsonb("details").default("{}"),
    takenAt: timestamp("taken_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIndex: index("test_results_user_id_idx").on(table.userId),
      testIdIndex: index("test_results_test_id_idx").on(table.userId),
    };
  }
);

export const relationsTestResults = relations(tableTestResults, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableTestResults.userId],
    references: [tableUsers.id],
  }),
  test: one(tablePersonalityTests, {
    fields: [tableTestResults.testId],
    references: [tablePersonalityTests.id],
  }),
}));

export const schemaTestResultsInsert = createInsertSchema(tableTestResults);
export const schemaTestResultsSelect = createSelectSchema(tableTestResults);
export type TestResultsInsert = InferInsertModel<typeof tableTestResults>;
export type TestResultsSelect = InferSelectModel<typeof tableTestResults>;
