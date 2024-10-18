import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import config from "../config";
import * as schema from "../schema";
import { Logger } from "drizzle-orm";

const pool = new Pool({
  host: config.db.host,
  port: config.db.port ? Number(config.db.port) : 5432,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export const drizzleDB = drizzle(pool, { schema });

export type dblogger = Logger;
export type dbType = typeof drizzleDB;
export type txType = Parameters<Parameters<typeof drizzleDB.transaction>[0]>[0];
export type txFn = Pick<txType, "rollback" | "setTransaction" | "transaction">;

export class dbSingleton {
  #logger: Logger;
  #temp: dbType;
  #tx: dbType;
  static #instance?: dbSingleton;

  private constructor(logger: Logger) {
    this.#logger = logger;
    const _db = drizzle(pool, { schema, logger });
    this.#temp = _db;
    this.#tx = _db;
  }

  /**
   * ### 取得 dbModel 單一實例
   *
   * 返回描述：
   * - 建立新實例時，應該帶入 logger
   * - 已有實例時，logger 不同會建立新實例
   * - 已有實例時，logger 相同會返回已有實例
   */
  static getInsance(logger: Logger) {
    if (
      /** 沒有實例 */
      !this.#instance ||
      /** 有實例且 logger 不同 */
      this.#instance.logger !== logger
    ) {
      this.#instance = new dbSingleton(logger);
    }
    return this.#instance;
  }

  get logger() {
    return this.#logger;
  }

  get db() {
    return this.#tx;
  }

  resetTx() {
    this.#tx = this.#temp;
  }

  setTx(tx: dbType) {
    this.#temp = this.#tx;
    this.#tx = tx;
  }
}

export const dbTransaction = <T>(
  logger: Logger,
  fn: (logger: Logger, txFn: txFn) => Promise<T>
) => {
  const ins = dbSingleton.getInsance(logger);

  return ins.db.transaction(async (tx) => {
    /** 暫時指向 */
    ins.setTx(tx);
    const res = await fn(ins.logger, {
      rollback: tx.rollback.bind(tx),
      setTransaction: tx.setTransaction.bind(tx),
      transaction: tx.transaction.bind(tx),
    });
    /** 復原指向 */
    ins.resetTx();
    return res;
  });
};
