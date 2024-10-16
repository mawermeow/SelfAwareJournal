export * from "./auth/drizzleAdapter";
export * from "./appleClientSecret";
export * from "./actionClient";
export * from "./logger";

export const convertToFormData = <T extends Record<string, unknown>>(originObj: T): FormData => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(originObj));
  return formData;
};
