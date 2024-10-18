// server-actions/createJournalEntry.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import { schemaJournalEntriesInsert, JournalEntryModel } from "@self-aware-journal/db/src";

const schema = schemaJournalEntriesInsert.required().pick({
  content: true,
  emotionScore: true,
  mood: true,
});

export const createJournalEntryAction = actionClient
  .schema(schema)
  .metadata({
    actionName: "createJournalEntry",
  })
  .action(async ({ parsedInput: { content, emotionScore, mood }, ctx: { userId } }) => {
    try {
      const journalModel = new JournalEntryModel(logger);
      const newEntry = await journalModel.create({
        userId,
        content,
        emotionScore,
        mood,
      });

      return newEntry[0];
    } catch (error) {
      throw new ActionError("提交日記失敗");
    }
  });
