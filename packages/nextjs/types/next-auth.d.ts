import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string | null; // 如果使用 CredentialsProvider，確保包含 password
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
