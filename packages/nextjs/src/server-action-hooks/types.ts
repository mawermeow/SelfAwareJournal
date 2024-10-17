/* 原來定義的 ActionError 只能在 use server 中使用 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}
