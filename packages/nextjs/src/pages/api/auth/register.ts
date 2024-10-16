// pages/api/auth/register.ts

import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { logger } from "@/lib";
import { UserModel } from "@self-aware-journal/db/src";

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "請填寫所有字段" });
  }

  const userModel = new UserModel(logger);

  const existingUser = await userModel.findFirst({ where: userModel.whereHelper({ email }) });

  if (existingUser) {
    return res.status(400).json({ message: "該電子郵件已被使用" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    email,
    name,
    password: hashedPassword,
  });

  return res.status(201).json({ message: "註冊成功", user: newUser });
};

export default register;
