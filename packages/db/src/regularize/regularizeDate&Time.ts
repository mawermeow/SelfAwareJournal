import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/zh-tw";

dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.extend(updateLocale);
// dayjs.updateLocale("zh-tw", {
//   weekStart: 1, // 設定每週的第一天為星期一
// });

/**
 * ### 說明
 * 這是一個正規化日期時間的函式\
 * 用來寫入資料庫的日期時間欄位
 */
export const regularizeDatetime = (date?: dayjs.ConfigType) => {
  return dayjs(date).tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ssZ");
};

/**
 * ### 說明
 * 這是一個正規化時間的函式\
 * 用來寫入資料庫的時間欄位
 */
export const regularizeTime = (date?: dayjs.ConfigType) => {
  return dayjs(date).tz("Asia/Taipei").format("HH:mm:ssZ");
};
