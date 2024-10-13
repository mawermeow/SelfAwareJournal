import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { logger, DrizzleAdapter, generateAppleClientSecret } from "@/lib";
import { UserModel } from "@self-aware-journal/db/src";

export const authOptions: NextAuthOptions = {
  // 配置身份驗證提供者
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: generateAppleClientSecret(), // 使用生成的 clientSecret
    }),
    // 可選：添加憑證提供者（如電子郵件/密碼）
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userModel = new UserModel(logger);
        const user = await userModel.findFirst({
          where: userModel.whereHelper({ email: credentials?.email }),
        });

        if (!user) {
          throw new Error("No user found with the given email");
        }

        // 您應該在這裡驗證密碼（例如使用 bcrypt）
        // if (!verifyPassword(credentials.password, user.password)) {
        //   throw new Error("Invalid password");
        // }

        return user;
      },
    }),
    // 添加更多提供者如需要
  ],

  // 使用自定義 Adapter
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

  // 其他配置選項
  session: {
    strategy: "jwt", // 使用 JWT 策略
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
