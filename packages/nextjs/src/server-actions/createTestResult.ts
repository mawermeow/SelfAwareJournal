// server-actions/createTestResult.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import {
  regularizeDatetime,
  schemaTestResultsInsert,
  TestResultModel,
} from "@self-aware-journal/db/src";

const schema = schemaTestResultsInsert.required().pick({
  testId: true,
  result: true,
  details: true,
  takenAt: true,
});

export const createTestResultAction = actionClient
  .schema(schema)
  .metadata({
    actionName: "createTestResult",
  })
  .action(async ({ parsedInput: { testId, result, details, takenAt }, ctx: { userId } }) => {
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
