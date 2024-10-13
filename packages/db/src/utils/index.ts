import crypto from "crypto";
import { v5 as uuidv5 } from "uuid";

export function generatePredictableUUID(name: string, branchId: string) {
  const hash = crypto.createHash("sha256");
  hash.update(`${name}-${branchId}`);
  const hex = hash.digest("hex");
  const uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-4${hex.substring(13, 16)}-8${hex.substring(17, 20)}-${hex.substring(20, 32)}`;
  return uuid;
}

const MY_NAMESPACE = "dcf70423-11b4-4872-b674-e084e29adb6c";
export const uuidv5WithString = (string: string): string => {
  return uuidv5(string, MY_NAMESPACE);
};
