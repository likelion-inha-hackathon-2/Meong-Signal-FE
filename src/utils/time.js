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
    // 이미 포맷된 한국어 날짜 문자열 확인
    if (
      typeof timestamp === "string" &&
      /^\d{4}년 \d{2}월 \d{2}일 \d{2}시 \d{2}분$/.test(timestamp)
    ) {
      return timestamp; // 이미 원하는 형식이므로 그대로 반환
    }

    // 다른 일반적인 날짜 형식 확인
    else if (typeof timestamp === "string") {
      const formats = [
        "YYYY-MM-DD HH:mm:ss",
        "YYYY/MM/DD HH:mm:ss",
        "DD/MM/YYYY HH:mm:ss",
        "MM/DD/YYYY HH:mm:ss",
        "YYYY년 MM월 DD일 HH시 mm분 ss초",
      ];
      messageTime = dayjs(timestamp, formats, true).tz(KST_TIMEZONE);
    } else {
      throw new Error("Unsupported timestamp format");
    }

    if (!messageTime.isValid()) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    console.error("Error parsing timestamp:", error, "Timestamp:", timestamp);
    return "유효하지 않은 시간 정보입니다.";
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
