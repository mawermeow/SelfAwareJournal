import { NIL } from "uuid";
import { drizzleDB, tableUsers } from "..";
import config from "../config";
import crypto from "crypto";

export default function () {
  return drizzleDB
    .insert(tableUsers)
    .values([
      {
        id: NIL,
        email: "ahri@mawer.cc",
        name: "Ahri",
        password: crypto
          .createHmac("sha256", config.admin.secret)
          .update("ahri@mawer.cc")
          .digest("base64"),
      },
    ])
    .onConflictDoNothing();
}
