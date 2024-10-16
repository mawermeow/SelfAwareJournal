// server-actions/submitPersonalityTest.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import {
  regularizeDatetime,
  schemaTestResultsInsert,
  TestResultModel,
} from "@self-aware-journal/db/src";

const submitPersonalityTestSchema = schemaTestResultsInsert.required().pick({
  testId: true,
  result: true,
  details: true,
  takenAt: true,
});

export const submitPersonalityTestAction = actionClient
  .schema(submitPersonalityTestSchema)
  .action(async ({ ctx: { userId }, parsedInput: { testId, result, details, takenAt } }) => {
    try {
      const testResultsModel = new TestResultModel(logger);
      const newTestResult = await testResultsModel.create({
        userId,
        testId,
        result,
        details,
        takenAt: regularizeDatetime(new Date(takenAt)),
      });

      return newTestResult[0];
    } catch (error) {
      throw new ActionError("提交心理測驗結果失敗");
    }
  });
