import { tableSessions } from "../schema";
import { CommonModel, dbSingleton } from "../core";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { Logger, getTableName } from "drizzle-orm";

const table = tableSessions;

type T = typeof table extends PgTableWithColumns<infer T> ? T : never;

/**
 * # Session
 * 用途：儲存用戶的 session 資訊。
 * @deprecated 目前將 session 資訊存儲在 cookies 中，此 model 暫時不使用。
 * */
export class SessionModel extends CommonModel<T> {
  static tableName = getTableName(table);

  #relationalQuery;

  constructor(logger: Logger) {
    const db = dbSingleton.getInsance(logger).db;
    super(db, table);
    this.#relationalQuery = db.query.tableSessions;
  }

  get findMany() {
    return this.#relationalQuery.findMany.bind(this.#relationalQuery);
  }

  get findFirst() {
    return this.#relationalQuery.findFirst.bind(this.#relationalQuery);
  }
}
