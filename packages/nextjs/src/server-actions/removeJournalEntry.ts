// server-actions/removeJournalEntry.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import {
  schemaJournalEntriesInsert,
  JournalEntryModel,
  regularizeDatetime,
} from "@self-aware-journal/db/src";

const schema = schemaJournalEntriesInsert.required().pick({
  id: true,
});

export const removeJournalEntryAction = actionClient
  .schema(schema)
  .metadata({
    actionName: "removeJournalEntry",
  })
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    try {
      const journalModel = new JournalEntryModel(logger);
      const updated = await journalModel.modify(
        {
          userId,
          id,
        },
        {
          deletedAt: regularizeDatetime(),
        }
      );

      return updated[0];
    } catch (error) {
      throw new ActionError("刪除日記失敗");
    }
  });
