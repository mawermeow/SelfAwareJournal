import { tableFeedbacks } from "../schema";
import { CommonModel, dbSingleton } from "../core";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { Logger, getTableName } from "drizzle-orm";

const table = tableFeedbacks;

type T = typeof table extends PgTableWithColumns<infer T> ? T : never;

/**
 * # 用戶反饋
 * 用途：收集用戶對平台的反饋與建議。
 * */
export class FeedbackModel extends CommonModel<T> {
  static tableName = getTableName(table);

  #relationalQuery;

  constructor(logger: Logger) {
    const db = dbSingleton.getInsance(logger).db;
    super(db, table);
    this.#relationalQuery = db.query.tableFeedbacks;
  }

  get findMany() {
    return this.#relationalQuery.findMany.bind(this.#relationalQuery);
  }

  get findFirst() {
    return this.#relationalQuery.findFirst.bind(this.#relationalQuery);
  }
}
