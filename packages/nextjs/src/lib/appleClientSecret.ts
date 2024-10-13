import jwt from "jsonwebtoken";

/**
 * 生成 Apple OAuth 客戶端密鑰
 */
export function generateAppleClientSecret() {
  const appleId = process.env.APPLE_ID!;
  const teamId = process.env.APPLE_TEAM_ID!;
  let privateKey = process.env.APPLE_PRIVATE_KEY!;
  const keyId = process.env.APPLE_KEY_ID!;

  if (!appleId || !teamId || !privateKey || !keyId) {
    throw new Error("缺少 Apple OAuth 配置環境變量");
  }

  // 替換 \n 為實際換行符
  privateKey = privateKey.replace(/\\n/g, "\n");

  const token = jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "180d", // Apple 建議的最大有效期為 180 天
    issuer: teamId,
    audience: "https://appleid.apple.com",
    subject: appleId,
    keyid: keyId,
  });

  return token;
}
