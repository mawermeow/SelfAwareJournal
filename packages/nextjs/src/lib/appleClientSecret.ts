import config from "@/config";
import jwt from "jsonwebtoken";

/**
 * 生成 Apple OAuth 客戶端密鑰
 */
export function generateAppleClientSecret() {
  const { clientId, teamId, privateKey, keyId } = config.apple;

  if (!clientId || !teamId || !privateKey || !keyId) {
    throw new Error("缺少 Apple OAuth 配置環境變量");
  }

  // 替換 \n 為實際換行符
  const formatPrivateKey = privateKey.replace(/\\n/g, "\n");

  const token = jwt.sign({}, formatPrivateKey, {
    algorithm: "ES256",
    expiresIn: "180d", // Apple 建議的最大有效期為 180 天
    issuer: teamId,
    audience: "https://appleid.apple.com",
    subject: clientId,
    keyid: keyId,
  });

  return token;
}
