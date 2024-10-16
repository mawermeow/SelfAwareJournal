// lib/auth/drizzleAdapter.ts
import { Adapter, AdapterUser, AdapterAccount, VerificationToken } from "next-auth/adapters";
import {
  AccountModel,
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
  const verificationTokenModel = new VerificationTokenModel(logger);

  return {
    async createUser(user: AdapterUser): Promise<AdapterUser> {
      const newUsers = await userModel.create({
        email: user.email!,
        name: user.name || "",
        image: user.image || "",
        emailVerified: regularizeDatetime(user.emailVerified) || null,
      });

      const newUser = newUsers[0];

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        emailVerified: newUser.emailVerified ? new Date(newUser.emailVerified) : null,
      };
    },

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

    async deleteUser(id: string): Promise<void> {
      // Soft delete
      await userModel.modify({ id }, { deletedAt: regularizeDatetime() });
    },

    // Link account (e.g., OAuth providers)
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

    // 用於做電子郵件驗證
    // TODO 這個方法應該在使用者註冊時被調用，尚未確認
    async createVerificationToken(token: VerificationToken): Promise<VerificationToken> {
      await verificationTokenModel.create({
        identifier: token.identifier,
        token: token.token,
        expiredAt: regularizeDatetime(token.expires),
      });
      return token;
    },

    // 用於做電子郵件驗證
    // TODO 這個方法應該在使用者點擊驗證連結時被調用，尚未確認
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

      // Delete token
      await verificationTokenModel.eradicate({
        identifier,
        token,
      });

      return { ...existingToken, expires: new Date(existingToken.expiredAt) };
    },

    // The following session methods are not needed when using JWT sessions.
    // Implement them as no-ops or remove them.

    // createSession: Not needed for JWT sessions
    async createSession(): Promise<any> {
      // No operation needed
    },

    // getSessionAndUser: Not needed for JWT sessions
    async getSessionAndUser(): Promise<any> {
      // No operation needed
    },

    // updateSession: Not needed for JWT sessions
    async updateSession(): Promise<any> {
      // No operation needed
    },

    // deleteSession: Not needed for JWT sessions
    async deleteSession(): Promise<any> {
      // No operation needed
    },
  };
}
