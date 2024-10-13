export const organizationStatusArray = ["ENABLED", "DISABLED"] as const;
export const branchStatusArray = ["ENABLED", "DISABLED"] as const;

/** 入庫 */
export enum InventoryRecordInEnum {
  /** 期初 */
  InitialInventory = "INITIAL_INVENTORY",
  /** 採購 */
  Purchase = "PURCHASE",
  /** 盤盈 */
  InventorySurplus = "INVENTORY_SURPLUS",
  /** 調入 */
  AdjustmentIn = "ADJUSTMENT_IN",
}
export const InventoryRecordInArr = Object.values(InventoryRecordInEnum);

/** 出庫 */
export enum InventoryRecordOutEnum {
  /** 銷售 */
  Sale = "SALE",
  /** 員購 */
  EmployeePurchase = "EMPLOYEE_PURCHASE",
  /** 領用 */
  Issue = "ISSUE",
  /** 盤虧 */
  InventoryLoss = "INVENTORY_LOSS",
  /** 調出 */
  AdjustmentOut = "ADJUSTMENT_OUT",
}
export const InventoryRecordOutArr = Object.values(InventoryRecordOutEnum);

export const InventoryRecordsCurrencyArray = ["NTD", "USD"] as const;
