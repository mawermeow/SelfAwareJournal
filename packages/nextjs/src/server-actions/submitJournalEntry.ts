// server-actions/submitJournalEntry.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import { schemaJournalEntriesInsert, JournalEntryModel } from "@self-aware-journal/db/src";

const submitJournalEntrySchema = schemaJournalEntriesInsert.required().pick({
  content: true,
  emotion_score: true,
  mood: true,
});

export const submitJournalEntryAction = actionClient
  .schema(submitJournalEntrySchema)
  .action(async ({ ctx: { userId }, parsedInput: { content, emotion_score, mood } }) => {
    try {
      const journalModel = new JournalEntryModel(logger);
      const newEntry = await journalModel.create({
        userId,
        content,
        emotion_score,
        mood,
      });

      return newEntry[0];
    } catch (error) {
      throw new ActionError("提交日記失敗");
    }
  });
