// lib/safeActionClient.ts
import { createSafeActionClient } from "next-safe-action";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { z } from "zod";

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError: (e, { metadata }) => {
    console.error(`Action error in ${metadata.actionName}:`, e.message);
    return {
      errorMessage: e.message,
    };
  },
}).use(async ({ ctx, next }) => {
  const sessionToken =
    cookies().get("next-auth.session-token")?.value ||
    cookies().get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    throw new ActionError("Unauthorized: Session token not found");
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET not set");
  }

  const payload = await decode({
    token: sessionToken,
    secret: secret,
  });

  if (!payload || !payload.sub || !payload.exp) {
    throw new ActionError("Unauthorized: Invalid session token");
  }

  const { name, email, id: userId, iat: issuedAt, exp: expiredAt } = payload;
  const currentTime = Date.now() / 1000;

  if (typeof expiredAt === "number" && currentTime > expiredAt) {
    throw new ActionError("Session expired");
  } else if (typeof expiredAt !== "number") {
    throw new ActionError("Invalid expiration time");
  }

  return next({
    ctx: { ...ctx, name, email, userId, issuedAt, expiredAt },
  });
});
