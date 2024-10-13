import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { text, pgTable, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tableVerificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      primaryKey: {
        columns: [table.identifier, table.token],
      },
      identifierIndex: index("verification_tokens_identifier_idx").on(table.identifier),
      tokenIndex: index("verification_tokens_token_idx").on(table.token),
    };
  }
);

export const schemaVerificationTokensInsert = createInsertSchema(tableVerificationTokens);
export const schemaVerificationTokensSelect = createSelectSchema(tableVerificationTokens);
export type VerificationTokensInsert = InferInsertModel<typeof tableVerificationTokens>;
export type VerificationTokensSelect = InferSelectModel<typeof tableVerificationTokens>;
