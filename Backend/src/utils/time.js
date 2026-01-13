import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const IST = "Asia/Kolkata";

export const toIST = (date) =>
  date ? dayjs.utc(date).tz(IST).format("YYYY-MM-DD HH:mm:ss") : null;
