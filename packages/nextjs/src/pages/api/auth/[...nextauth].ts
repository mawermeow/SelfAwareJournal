// pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { logger, DrizzleAdapter, generateAppleClientSecret } from "@/lib";
import { NextApiRequest } from "next";
import { UserModel } from "@self-aware-journal/db/src";

interface Credentials {
  email: string;
  password: string;
}

interface AuthorizeParams {
  credentials?: Credentials;
  req: NextApiRequest;
}

export const authOptions: NextAuthOptions = {
  // 配置身份驗證提供者
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // AppleProvider({
    //   clientId: process.env.APPLE_CLIENT_ID!,
    //   clientSecret: generateAppleClientSecret(), // 使用生成的 clientSecret
    // }),
    // 可選：添加憑證提供者（如電子郵件/密碼）
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // 檢查 credentials 是否存在
        if (!credentials) {
          throw new Error("Credentials are required");
        }

        // 解構 email 和 password 並進行檢查
        const { email, password } = credentials;
        if (!email || typeof email !== "string") {
          throw new Error("Invalid or missing email");
        }
        if (!password || typeof password !== "string") {
          throw new Error("Invalid or missing password");
        }

        try {
          const userModel = new UserModel(logger);

          const user = await userModel.findFirst({
            where: userModel.whereHelper({ email }),
          });
          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          // 移除密碼字段，避免重複聲明
          const { password: userPassword, ...userWithoutPassword } = user;

          return userWithoutPassword as User;
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  // 使用自定義 Adapter，它會在使用 OAuth providers 進行身份驗證時被調用
  adapter: DrizzleAdapter({ logger }),

  // 認證頁面（可選）
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // 錯誤頁面
    verifyRequest: "/auth/verify-request", // 驗證請求頁面
    newUser: "/auth/new-user", // 新用戶頁面
  },

  // 回調函數（可選）
  callbacks: {
    async signIn({ user }) {
      // 成功登入後返回 true，讓 NextAuth 自行處理 cookies
      return true;
    },
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  session: {
    // strategy: "database", // 將 session 存儲在資料庫中，每次讀取時都要讀/寫資料庫
    strategy: "jwt", // 將 session 存儲在 JWT 中，每次讀取時只需解碼 JWT
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
