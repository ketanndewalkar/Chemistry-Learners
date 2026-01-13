import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const IST = "Asia/Kolkata";

const convertDatesToIST = (obj) => {
  for (const key in obj) {
    if (obj[key] instanceof Date) {
      obj[key] = dayjs(obj[key])
        .tz(IST)
        .format("YYYY-MM-DD HH:mm:ss");
    } 
    else if (Array.isArray(obj[key])) {
      obj[key].forEach(item => convertDatesToIST(item));
    } 
    else if (typeof obj[key] === "object" && obj[key] !== null) {
      convertDatesToIST(obj[key]);
    }
  }
};

export const istTransform = (schema) => {
  schema.set("toJSON", {
    transform: (doc, ret) => {
      convertDatesToIST(ret);
      return ret;
    },
  });
};
