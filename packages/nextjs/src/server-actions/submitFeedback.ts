// server-actions/submitFeedback.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import { schemaFeedbacksInsert, FeedbackModel } from "@self-aware-journal/db/src";

const submitFeedbackSchema = schemaFeedbacksInsert.required().pick({
  feedbackType: true,
  message: true,
});

export const submitFeedbackAction = actionClient
  .schema(submitFeedbackSchema)
  .action(async ({ ctx: { userId }, parsedInput: { feedbackType, message } }) => {
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
