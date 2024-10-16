// server-actions/getAIAnalysis.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import { schemaAIAnalysesSelect, AIAnalyseModel } from "@self-aware-journal/db/src";

const getAIAnalysisSchema = schemaAIAnalysesSelect.required().pick({
  journalId: true,
});

export const getAIAnalysisAction = actionClient
  .schema(getAIAnalysisSchema)
  .action(async ({ ctx, parsedInput: { journalId } }) => {
    try {
      const aiAnalysisModel = new AIAnalyseModel(logger);
      const analyses = await aiAnalysisModel.findMany({
        where: aiAnalysisModel.whereHelper({ journalId }),
      });

      return analyses;
    } catch (error) {
      throw new ActionError("獲取分析結果失敗");
    }
  });
