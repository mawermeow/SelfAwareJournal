// server-actions/getJournalEntries.ts
"use server";

import { z } from "zod";
import { logger, actionClient, ActionError } from "@/lib";
import { JournalEntryModel } from "@self-aware-journal/db/src";

const getJournalEntriesSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(10),
  offset: z.number().min(0).optional().default(0),
});

export const getJournalEntriesAction = actionClient
  .schema(getJournalEntriesSchema)
  .action(async ({ ctx: { userId }, parsedInput: { limit, offset } }) => {
    try {
      const journalModel = new JournalEntryModel(logger);
      const entries = await journalModel.findMany({
        where: journalModel.whereHelper({ userId }),
        limit,
        offset,
        orderBy: journalModel.orderByHelper([{ column: "createdAt", order: "desc" }]),
      });

      return entries;
    } catch (error) {
      throw new ActionError("獲取日記列表失敗");
    }
  });
