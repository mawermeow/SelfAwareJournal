// server-actions/getUser.ts
"use server";

import { logger, actionClient, ActionError } from "@/lib";
import { schemaUsersInsert, UserModel } from "@self-aware-journal/db/src";

const getUserSchema = schemaUsersInsert.required().pick({
  id: true,
});

export const getUserAction = actionClient
  .schema(getUserSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const userModel = new UserModel(logger);
      const user = await userModel.findFirst({
        where: userModel.whereHelper({ id }),
      });
      if (!user) throw new ActionError("查無用戶資料");

      const { password, ...rest } = user;

      return { ...rest };
    } catch (error) {
      throw new ActionError(`查詢用戶資料失敗:${error}`);
    }
  });
