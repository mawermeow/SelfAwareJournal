import { tableTestResults } from "../schema";
import { CommonModel, dbSingleton } from "../core";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { Logger, getTableName } from "drizzle-orm";

const table = tableTestResults;

type T = typeof table extends PgTableWithColumns<infer T> ? T : never;

/**
 * # 測驗結果
 * 用途：存儲用戶的測驗結果。
 * */
export class TestResultModel extends CommonModel<T> {
  static tableName = getTableName(table);

  #relationalQuery;

  constructor(logger: Logger) {
    const db = dbSingleton.getInsance(logger).db;
    super(db, table);
    this.#relationalQuery = db.query.tableTestResults;
  }

  get findMany() {
    return this.#relationalQuery.findMany.bind(this.#relationalQuery);
  }

  get findFirst() {
    return this.#relationalQuery.findFirst.bind(this.#relationalQuery);
  }
}
