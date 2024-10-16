import { tableVerificationTokens } from "../schema";
import { CommonModel, dbSingleton } from "../core";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { Logger, getTableName } from "drizzle-orm";

const table = tableVerificationTokens;

type T = typeof table extends PgTableWithColumns<infer T> ? T : never;

/**
 * # 用戶電子郵件驗證
 * 用途：存儲用戶的電子郵件驗證標記。
 * */
export class VerificationTokenModel extends CommonModel<T> {
  static tableName = getTableName(table);

  #relationalQuery;

  constructor(logger: Logger) {
    const db = dbSingleton.getInsance(logger).db;
    super(db, table);
    this.#relationalQuery = db.query.tableVerificationTokens;
  }

  get findMany() {
    return this.#relationalQuery.findMany.bind(this.#relationalQuery);
  }

  get findFirst() {
    return this.#relationalQuery.findFirst.bind(this.#relationalQuery);
  }
}
