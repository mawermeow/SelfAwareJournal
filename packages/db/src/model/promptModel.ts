import { tablePrompts } from "../schema";
import { CommonModel, dbSingleton } from "../core";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { Logger, getTableName } from "drizzle-orm";

const table = tablePrompts;

type T = typeof table extends PgTableWithColumns<infer T> ? T : never;

/**
 * # 引導提示
 * 用途：存儲不同類型的引導提示，用於引導用戶思考或日記寫作。
 * */
export class PromptModel extends CommonModel<T> {
  static tableName = getTableName(table);

  #relationalQuery;

  constructor(logger: Logger) {
    const db = dbSingleton.getInsance(logger).db;
    super(db, table);
    this.#relationalQuery = db.query.tablePrompts;
  }

  get findMany() {
    return this.#relationalQuery.findMany.bind(this.#relationalQuery);
  }

  get findFirst() {
    return this.#relationalQuery.findFirst.bind(this.#relationalQuery);
  }
}
