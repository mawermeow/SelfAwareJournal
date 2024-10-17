// server-actions/createFeedback.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import { schemaFeedbacksInsert, FeedbackModel } from "@self-aware-journal/db/src";

const schema = schemaFeedbacksInsert.required().pick({
  feedbackType: true,
  message: true,
});

export const createFeedbackAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { feedbackType, message }, ctx: { userId } }) => {
    try {
      const feedbackModel = new FeedbackModel(logger);
      const newFeedback = await feedbackModel.create({
        userId,
        feedbackType,
        message,
      });

      return newFeedback[0];
    } catch (error) {
      throw new ActionError("提交反饋失敗");
    }
  });
