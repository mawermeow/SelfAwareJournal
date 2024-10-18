import "dotenv/config";

export default {
  node: {
    env: process.env.NODE_ENV || "development",
  },
  db: {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "",
    user: process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PASSWORD || "",
  },
  /* [使用 OAuth 2.0 存取 Google API](https://developers.google.com/identity/protocols/oauth2?hl=zh-tw) */
  google: {
    /*
     GOOGLE_CLIENT_ID 是你從 Google Cloud Platform (GCP) 中創建 OAuth 憑證時獲得的「Client ID」，
     用來標識你的應用程式。
    */
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    /*
     GOOGLE_CLIENT_SECRET 是你從 GCP 中與「Client ID」配對獲得的「Client Secret」，
     它用來驗證你的應用程式。
    */
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
  /* 使用 Apple 進行登入驗證，需要加入 [Apple Developer Program](https://developer.apple.com/programs/whats-included/)*/
  apple: {
    /*
     APPLE_CLIENT_ID 是 Apple OAuth 中的「Client ID」，也稱為「Service ID」。\
     它是你在 Apple Developer 入口網站中創建的 Service ID，並且標識你的應用程式。
    */
    clientId: process.env.APPLE_CLIENT_ID || "",
    /*
     APPLE_TEAM_ID 是 Apple 會為每個開發者帳戶分配的團隊 ID (Team ID)，
     它用來標識你的 Apple 開發者帳戶。你可以在 Apple Developer 中的帳戶資訊中找到這個值。
    */
    teamId: process.env.APPLE_TEAM_ID || "",
    /*
     APPLE_PRIVATE_KEY 是你在 Apple Developer 平台上生成的私鑰，這個私鑰用來簽署 JWT token，完成身份驗證。\
     私鑰是和 Key ID 一起生成的。在 .env 檔案中配置時，若私鑰包含換行符，請使用 \n 來代替換行符。
    */
    privateKey: process.env.APPLE_PRIVATE_KEY || "",
    /*
     APPLE_KEY_ID 是你在生成 Apple Private Key 時，由 Apple 分配的一個「Key ID」。
     它用來識別這個私鑰，並且在 OAuth 流程中和私鑰一起使用。
    */
    keyId: process.env.APPLE_KEY_ID || "",
  },
  nextAuth: {
    /*
     這是 NextAuth.js 的加密秘鑰，用來保護 JWT token 和 session 的安全性。
     當使用 NextAuth.js 管理身份驗證時，你需要設置這個值來確保系統的安全。
    */
    secret: process.env.NEXTAUTH_SECRET || "",
  },
};
