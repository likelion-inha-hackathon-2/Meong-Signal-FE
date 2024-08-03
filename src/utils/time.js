import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

const KST_TIMEZONE = "Asia/Seoul";

export const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    console.warn("Timestamp is null or undefined");
    return "시간 정보가 없습니다.";
  }

  let messageTime;
  try {
    if (
      typeof timestamp === "string" &&
      /^\d{4}년 \d{2}월 \d{2}일 \d{2}시 \d{2}분$/.test(timestamp)
    ) {
      return timestamp;
    } else if (typeof timestamp === "string") {
      const formats = [
        "YYYY-MM-DD HH:mm:ss",
        "YYYY/MM/DD HH:mm:ss",
        "DD/MM/YYYY HH:mm:ss",
        "MM/DD/YYYY HH:mm:ss",
        "YYYY년 MM월 DD일 HH시 mm분 ss초",
      ];
      messageTime = dayjs(timestamp, formats, true).tz(KST_TIMEZONE);
    } else if (typeof timestamp === "number") {
      messageTime = dayjs(timestamp).tz(KST_TIMEZONE);
    } else {
      throw new Error("Unsupported timestamp format");
    }

    if (!messageTime.isValid()) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    console.error("Error parsing timestamp:", error, "Timestamp:", timestamp);
    return null;
  }

  return messageTime.format("YYYY년 MM월 DD일 HH시 mm분");
};

export const formatHourMinute = (timestamp) => {
  if (!timestamp || !dayjs(timestamp).isValid()) {
    return "시간 정보가 없습니다.";
  }

  const messageTime = dayjs(timestamp).tz(KST_TIMEZONE);
  return messageTime.format("HH시 mm분");
};

export const getCurrentTimestamp = () => {
  return dayjs().tz(KST_TIMEZONE).format();
};

// 산책기록에 사용될 날짜 전용 변환 함수
export const formatDogRecordDate = (timestamp) => {
  if (!timestamp) {
    return "시간 정보가 없습니다.";
  }
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return "시간 정보가 없습니다.";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
};
