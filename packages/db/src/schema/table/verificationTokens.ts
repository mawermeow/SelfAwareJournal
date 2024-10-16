import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { text, pgTable, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * # 用戶電子郵件驗證 table
 * 用途：存儲用戶的電子郵件驗證標記。
 * */
export const tableVerificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(), // 驗證標記識別符 (如電子郵件)
    token: text("token").notNull(),
    expiredAt: timestamp("expired_at", { mode: "string" }).notNull(), // 過期時間
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
