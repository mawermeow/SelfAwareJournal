import {
  PgColumn,
  PgDelete,
  PgInsert,
  PgInsertValue,
  PgTableWithColumns,
  PgUpdate,
  PgUpdateSetSource,
  SelectedFieldsFlat,
  TableConfig,
} from "drizzle-orm/pg-core";
import {
  SQL,
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  notInArray,
  or,
} from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { SelectResultFields } from "drizzle-orm/query-builders/select.types";
import { compact } from "lodash/fp";
import { dbType } from "./drizzle";

export interface QueryOpts {
  forUpdate?: boolean;
  /** @deprecated 不再需要 */
  returning?: string[];
}

export interface QueryOptsWithReturn<
  TTable,
  TSelectedFields extends SelectedFieldsFlat = SelectedFieldsFlat,
> extends QueryOpts {
  drizzleReturning: (table: TTable) => TSelectedFields;
}

type TC<T extends TableConfig> = PgTableWithColumns<T>;

/**
 * ### Insert Return What?
 * 用來判定 insert 之後的 returning 的結果
 */
type InsRtnWut<
  TTable extends TC<TableConfig>,
  TOpts extends QueryOpts | QueryOptsWithReturn<TTable> = QueryOpts,
> = PgInsert<
  TTable,
  NodePgQueryResultHKT,
  TOpts extends QueryOptsWithReturn<TTable, infer S>
    ? SelectResultFields<S>
    : TTable["_"]["inferSelect"]
>;

type UpdRtnWut<
  TTable extends TC<TableConfig>,
  TOpts extends QueryOpts | QueryOptsWithReturn<TTable> = QueryOpts,
> = PgUpdate<
  TTable,
  NodePgQueryResultHKT,
  TOpts extends QueryOptsWithReturn<TTable, infer S>
    ? SelectResultFields<S>
    : TTable["_"]["inferSelect"]
>;

type DelRtnWut<
  TTable extends TC<TableConfig>,
  TOpts extends QueryOpts | QueryOptsWithReturn<TTable> = QueryOpts,
> = PgDelete<
  TTable,
  NodePgQueryResultHKT,
  TOpts extends QueryOptsWithReturn<TTable, infer S>
    ? SelectResultFields<S>
    : TTable["_"]["inferSelect"]
>;

type StringKeyof<T> = keyof T & string;
type Depth = 0 | 1 | 2 | 3 | 4 | 5;

type ColumnKeyPath<T extends object, D extends Depth = 5> = D extends 0
  ? never
  : {
      [K in StringKeyof<T>]: T[K] extends Date
        ? K
        : T[K] extends object
          ? `${K}.${ColumnKeyPath<T[K], PrevDepth<D>>}`
          : K;
    }[StringKeyof<T>];

type PrevDepth<D extends Depth> = D extends 5
  ? 4
  : D extends 4
    ? 3
    : D extends 3
      ? 2
      : D extends 2
        ? 1
        : 0;

export type Filter<T extends {} = any> =
  | {
      column: T extends object ? ColumnKeyPath<T> : string;
      value: string | number | boolean | null;
      method: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
    }
  | {
      column: T extends object ? ColumnKeyPath<T> : string;
      value: string[] | number[];
      method: "in" | "notIn";
    }
  | {
      // like 情況的話 column 彼此預設是 or 關係
      column: (T extends object ? ColumnKeyPath<T> : string)[];
      value: string;
      method: "like" | "iLike";
    };

export type FilterLike<T extends {} = any> = Filter<T> | "" | undefined;

export type Sort<T> = {
  column: keyof T;
  order: "asc" | "desc";
};

export type Condition<TTableConfig extends TableConfig> =
  | FilterLike<TC<TTableConfig>["$inferSelect"]>[]
  | Partial<TC<TTableConfig>["$inferSelect"]>
  | SQL<unknown>
  | undefined;

const whereHelperBuilder =
  <T extends TableConfig>(table: TC<T>) =>
  (filtersOrObject: Condition<T>, operate: "or" | "and" = "and") => {
    if (!filtersOrObject) return undefined;
    if (filtersOrObject instanceof SQL) return filtersOrObject;

    // 舊版本轉換 (object 用法)
    const oldObjectVersionToFilters = (o: Partial<TC<T>["$inferSelect"]>) => {
      return Object.entries(o).map(
        ([column, value]) =>
          ({
            column: column as keyof TC<T>["$inferSelect"],
            method: "eq",
            value: value,
          }) as FilterLike<TC<T>["$inferSelect"]>
      );
    };
    const filters = compact(
      !Array.isArray(filtersOrObject) ? oldObjectVersionToFilters(filtersOrObject) : filtersOrObject
    );

    const whereClauses = filters.map(({ value, method, column }) => {
      // const columnPrefix = rawSQL ? `${tableAlias}.` : "";

      // console.log(filter);
      switch (method) {
        // 可以加入其他條件類型的處理
        case "eq":
          if (value === null) return isNull(table[column]);
          return eq(table[column], value);

        case "ne":
          if (value === null) return isNotNull(table[column]);
          return ne(table[column], value);

        case "lt":
          return lt(table[column], value);

        case "lte":
          return lte(table[column], value);

        case "gt":
          return gt(table[column], value);

        case "gte":
          return gte(table[column], value);

        case "in":
          return inArray(table[column], value);

        case "notIn":
          return notInArray(table[column], value);

        case "like":
          return or(...column.map((c) => like(table[c], `%${value}%`)));

        case "iLike":
          return or(...column.map((c) => ilike(table[c], `%${value}%`)));

        default:
          throw new Error(`Unknown filter method: ${{ value, method, column }}`);
      }
    });

    // 使用 reduce 將所有 where 子句合併成單一的查詢
    const finalQuery = operate === "and" ? and(...whereClauses) : or(...whereClauses);

    return finalQuery;
  };

const orderByHelperBuilder =
  <T extends TableConfig>(table: TC<T>) =>
  (sorts: Sort<T["columns"]>[]) => {
    const orderBy = sorts.map((s) => {
      const column = table[s.column];
      return s.order === "asc" ? asc(column) : desc(column);
    });

    return orderBy;
  };

export class CommonModel<T extends TableConfig> {
  protected _db: dbType;
  #table: TC<T>;
  #whereHelper: ReturnType<typeof whereHelperBuilder<T>>;
  #orderByHelper: ReturnType<typeof orderByHelperBuilder<T>>;

  constructor(db: dbType, table: TC<T>) {
    this._db = db;
    this.#table = table;
    this.#whereHelper = whereHelperBuilder(this.#table);
    this.#orderByHelper = orderByHelperBuilder(this.#table);
  }

  get whereHelper() {
    return this.#whereHelper;
  }

  get orderByHelper() {
    return this.#orderByHelper;
  }

  /**
   * @function
   * @summary 新增
   *
   */
  create(input: PgInsertValue<TC<T>>): InsRtnWut<TC<T>>;
  create<TOpt extends QueryOpts | QueryOptsWithReturn<TC<T>>>(
    input: PgInsertValue<TC<T>>,
    options: TOpt
  ): InsRtnWut<TC<T>, TOpt>;
  create<TSelFlds extends SelectedFieldsFlat>(
    input: PgInsertValue<TC<T>>,
    options?: QueryOpts | QueryOptsWithReturn<TC<T>, TSelFlds>
  ) {
    const _db = this._db;
    const query = _db.insert(this.#table).values(input).$dynamic();

    const returning =
      options && "drizzleReturning" in options
        ? query.returning(options.drizzleReturning(this.#table))
        : query.returning();

    return returning;
  }

  /**
   * @function
   * @summary 新增多個
   *
   */
  createAll(input: PgInsertValue<TC<T>>[]): InsRtnWut<TC<T>>;
  createAll<TOpt extends QueryOpts | QueryOptsWithReturn<TC<T>>>(
    input: PgInsertValue<TC<T>>[],
    options: TOpt
  ): InsRtnWut<TC<T>, TOpt>;
  createAll<TSelFlds extends SelectedFieldsFlat>(
    input: PgInsertValue<TC<T>>[],
    options?: QueryOpts | QueryOptsWithReturn<TC<T>, TSelFlds>
  ) {
    if (!input || !input.length) return [];
    const _db = this._db;
    const query = _db.insert(this.#table).values(input).$dynamic();

    const returning =
      options && "drizzleReturning" in options
        ? query.returning(options.drizzleReturning(this.#table))
        : query.returning();

    return returning;
  }

  /**
   * @function
   * @summary 修改
   */
  modify(condition: Condition<T>, input: PgUpdateSetSource<TC<T>>): UpdRtnWut<TC<T>>;
  modify<TOpt extends QueryOpts | QueryOptsWithReturn<TC<T>>>(
    condition: Condition<T>,
    input: PgUpdateSetSource<TC<T>>,
    options: TOpt
  ): UpdRtnWut<TC<T>, TOpt>;
  modify<TSelFlds extends SelectedFieldsFlat>(
    condition: Condition<T>,
    input: PgUpdateSetSource<TC<T>>,
    options?: QueryOpts | QueryOptsWithReturn<TC<T>, TSelFlds>
  ) {
    // const _db = options?.trx ? options?.trx : this.#drizzle;
    const _db = this._db;
    const query = _db.update(this.#table).set(input).where(this.#whereHelper(condition)).$dynamic();

    // options?.logger?.debug("modify", query.toString());

    const returning =
      options && "drizzleReturning" in options
        ? query.returning(options.drizzleReturning(this.#table))
        : query.returning();

    return returning;
  }

  /**
   * @function
   * @summary 刪除
   */
  eradicate(condition: Condition<T>): DelRtnWut<TC<T>>;
  eradicate<TOpt extends QueryOpts | QueryOptsWithReturn<TC<T>>>(
    condition: Condition<T>,
    options: TOpt
  ): DelRtnWut<TC<T>, TOpt>;
  eradicate<TSelFlds extends SelectedFieldsFlat>(
    condition: Condition<T>,
    options?: QueryOpts | QueryOptsWithReturn<TC<T>, TSelFlds>
  ) {
    const _db = this._db;
    const query = _db.delete(this.#table).where(this.#whereHelper(condition)).$dynamic();

    const returning =
      options && "drizzleReturning" in options
        ? query.returning(options.drizzleReturning(this.#table))
        : query.returning();

    return returning;
  }

  /**
   * @function
   * @summary 取得數量
   */
  async count(condition: Condition<T>, options?: QueryOpts) {
    const _db = this._db;
    const query = _db
      .select({
        count: count(),
      })
      .from(this.#table)
      .where(this.#whereHelper(condition));

    const [row] = await query;

    return +row.count;
  }

  /**
   * @function
   * @summary 是否已存在
   */
  async isExisted(condition: Condition<T>, options?: QueryOpts) {
    const _db = this._db;
    const query = _db
      .select({
        count: count(),
      })
      .from(this.#table)
      .where(this.#whereHelper(condition));

    const [row] = await query;

    return +row.count >= 1;
  }

  /**
   * @function
   * @summary 是否全部都存在
   */
  async isAllExisted(ids: string[], condition: Condition<T>, options?: QueryOpts) {
    const _db = this._db;
    const query = _db
      .select({
        count: count(),
      })
      .from(this.#table)
      .where(
        and(
          condition
            ? condition instanceof SQL
              ? condition
              : this.#whereHelper(condition)
            : undefined,
          inArray<PgColumn>(this.#table.id, ids)
        )
      );

    const [row] = await query;

    return +row.count === ids.length;
  }
}
