import {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
import {
  AccountModel,
  SessionModel,
  UserModel,
  VerificationTokenModel,
  regularizeDatetime,
} from "@self-aware-journal/db/src";
import { Logger } from "drizzle-orm";

interface AdapterOptions {
  logger: Logger;
}

export function DrizzleAdapter({ logger }: AdapterOptions): Adapter {
  const userModel = new UserModel(logger);
  const accountModel = new AccountModel(logger);
  const sessionModel = new SessionModel(logger);
  const verificationTokenModel = new VerificationTokenModel(logger);

  return {
    // 創建新用戶
    async createUser(user: AdapterUser): Promise<AdapterUser> {
      const newUsers = await userModel.create({
        email: user.email!,
        name: user.name || "",
        image: user.image || "",
        emailVerified: regularizeDatetime(user.emailVerified) || null,
      });

      const newUser = newUsers[0]; // 假設 create 返回一個數組

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        emailVerified: newUser.emailVerified ? new Date(newUser.emailVerified) : null,
      };
    },

    // 讀取用戶通過 ID
    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await userModel.findFirst({
        where: userModel.whereHelper({ id }),
      });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      };
    },

    // 讀取用戶通過電子郵件
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const user = await userModel.findFirst({
        where: userModel.whereHelper({ email }),
      });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      };
    },

    // 更新用戶
    async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      await userModel.modify(
        { id: user.id },
        {
          name: user.name ?? undefined,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified ? regularizeDatetime(user.emailVerified) : undefined,
        }
      );

      const updatedUser = await userModel.findFirst({
        where: userModel.whereHelper({ id: user.id }),
      });
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        emailVerified: updatedUser.emailVerified ? new Date(updatedUser.emailVerified) : null,
      };
    },

    // 刪除用戶
    async deleteUser(id: string): Promise<void> {
      await userModel.eradicate({ id });
    },

    // 創建帳號（如 OAuth 提供者）
    async linkAccount(account: AdapterAccount): Promise<void> {
      await accountModel.create({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refreshToken: account.refresh_token,
        accessToken: account.access_token,
        expiresAt: account.expires_at ? regularizeDatetime(account.expires_at) : null,
        tokenType: account.token_type || "",
        scope: account.scope || "",
        idToken: account.id_token || "",
        sessionState: account.session_state || "",
      });
    },

    // 查找帳號
    async getUserByAccount({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }): Promise<AdapterUser | null> {
      const account = await accountModel.findFirst({
        where: accountModel.whereHelper({
          provider,
          providerAccountId: providerAccountId,
        }),
        with: { user: true },
      });

      if (!account || !account.user) return null;

      const user = account.user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      };
    },

    // 刪除帳號
    async unlinkAccount({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }): Promise<void> {
      await accountModel.eradicate({
        provider,
        providerAccountId: providerAccountId,
      });
    },

    // 創建會話
    async createSession(session: AdapterSession): Promise<AdapterSession> {
      const newSession = await sessionModel.create({
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: regularizeDatetime(session.expires),
      });
      return {
        sessionToken: newSession[0].sessionToken,
        userId: newSession[0].userId,
        expires: new Date(newSession[0].expires),
      };
    },

    // 讀取會話通過會話令牌
    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session = await sessionModel.findFirst({
        where: sessionModel.whereHelper({ sessionToken: sessionToken }),
        with: { user: true },
      });

      if (!session || !session.user) return null;

      const user = session.user;
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: new Date(session.expires),
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        },
      };
    },

    // 更新會話
    async updateSession(
      session: Partial<AdapterSession> & { sessionToken: string }
    ): Promise<AdapterSession> {
      const [updatedSession] = await sessionModel.modify(
        { sessionToken: session.sessionToken },
        {
          expires: regularizeDatetime(session.expires),
          userId: session.userId,
        }
      );

      if (!updatedSession) {
        throw new Error("Session not found");
      }
      return {
        sessionToken: updatedSession.sessionToken,
        userId: updatedSession.userId,
        expires: new Date(updatedSession.expires),
      };
    },

    // 刪除會話
    async deleteSession(sessionToken: string): Promise<void> {
      await sessionModel.eradicate({ sessionToken: sessionToken });
    },

    // 創建驗證令牌
    async createVerificationToken(token: VerificationToken): Promise<VerificationToken> {
      await verificationTokenModel.create({
        identifier: token.identifier,
        token: token.token,
        expires: regularizeDatetime(token.expires),
      });
      return token;
    },

    // 讀取並使用驗證令牌
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }): Promise<VerificationToken | null> {
      const existingToken = await verificationTokenModel.findFirst({
        where: verificationTokenModel.whereHelper({ identifier, token }),
      });

      if (!existingToken) return null;

      // 刪除令牌
      await verificationTokenModel.eradicate({
        identifier,
        token,
      });

      return { ...existingToken, expires: new Date(existingToken.expires) };
    },
  };
}
