// server-actions/getPersonalityTests.ts
"use server";

import { z } from "zod";
import { logger, actionClient, ActionError } from "@/lib";
import { PersonalityTestModel } from "@self-aware-journal/db/src";

// 定義輸入的 schema，這裡我們使用分頁參數
const getPersonalityTestsSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(10),
  offset: z.number().min(0).optional().default(0),
});

// 定義 server-action
export const getPersonalityTestsAction = actionClient
  .schema(getPersonalityTestsSchema)
  .action(async ({ ctx, parsedInput: { limit, offset } }) => {
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
