// server-actions/getPersonalityTests.ts
"use server";

import { z } from "zod";
import { logger, actionClient, ActionError } from "@/lib";
import { PersonalityTestModel } from "@self-aware-journal/db/src";

const schema = z.object({
  limit: z.number().min(1).max(100).optional().default(10),
  offset: z.number().min(0).optional().default(0),
});
export const getPersonalityTestsAction = actionClient
  .schema(schema)
  .metadata({
    actionName: "getPersonalityTests",
  })
  .action(async ({ parsedInput: { limit, offset }, ctx }) => {
    try {
      const personalityTestModel = new PersonalityTestModel(logger);
      const tests = await personalityTestModel.findMany({
        where: personalityTestModel.whereHelper({ deletedAt: null }),
        limit,
        offset,
        orderBy: personalityTestModel.orderByHelper([{ column: "createdAt", order: "desc" }]),
      });

      return tests;
    } catch (error) {
      throw new ActionError("獲取性格測驗資料失敗");
    }
  });
