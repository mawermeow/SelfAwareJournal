import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { uuid, text, pgTable, date, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tableUsers } from "./users";
import { fieldCUDTimestamps } from "../core/schemaFields";

/* 訂閱與計劃 ENUM */
export const subscriptionStatusPgEnum = pgEnum("subscriptions_status", [
  "active",
  "inactive",
  "canceled",
]);

export const tableSubscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => tableUsers.id, { onDelete: "cascade" }),
    planName: text("plan_name").notNull(),
    status: subscriptionStatusPgEnum("status").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    ...fieldCUDTimestamps,
  },
  (table) => {
    return {
      userIdIndex: index("subscriptions_user_id_idx").on(table.userId),
      statusIndex: index("subscriptions_status_idx").on(table.status),
    };
  }
);

export const relationsSubscriptions = relations(tableSubscriptions, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableSubscriptions.userId],
    references: [tableUsers.id],
  }),
}));

export const schemaSubscriptionsInsert = createInsertSchema(tableSubscriptions);
export const schemaSubscriptionsSelect = createSelectSchema(tableSubscriptions);
export type SubscriptionsInsert = InferInsertModel<typeof tableSubscriptions>;
export type SubscriptionsSelect = InferSelectModel<typeof tableSubscriptions>;
