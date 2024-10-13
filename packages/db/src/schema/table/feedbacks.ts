import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, varchar, pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { fieldCUDTimestamps } from "../core/schemaFields";

export const tableFeedbacks = pgTable(
  "feedbacks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => tableUsers.id, { onDelete: "set null" }),
    feedbackType: varchar("feedback_type", { length: 50 }).notNull(),
    message: text("message").notNull(),
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
