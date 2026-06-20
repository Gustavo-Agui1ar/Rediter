import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useMemo, useState } from "react";

const secondsInMinutes = 60;
const secondsInHour = 3600;
const secondsInDay = 86400;

interface UseFormattedDateOptions {
  updateInterval?: number;
}

export function useFormattedDate(
  dateString: string,
  options?: UseFormattedDateOptions,
): string {
  const { updateInterval = 60000 } = options || {};
  const { t } = useLanguage();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const formattedDate = useMemo(() => {
    let safeDateString = dateString.replace(" ", "T");
    if (!safeDateString.endsWith("Z")) {
      safeDateString += "Z";
    }

    const date = new Date(safeDateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

    if (diffInSeconds < secondsInMinutes) {
      const seconds = diffInSeconds < 0 ? 0 : diffInSeconds;
      return `${seconds} ${t("seconds_ago")}`;
    }

    if (diffInSeconds < secondsInHour)
      return `${Math.floor(diffInSeconds / secondsInMinutes)} ${t("minutes_ago")}`;

    if (diffInSeconds < secondsInDay)
      return `${Math.floor(diffInSeconds / secondsInHour)} ${t("hours_ago")}`;

    if (diffInSeconds < secondsInDay * 7)
      return `${Math.floor(diffInSeconds / secondsInDay)} ${t("days_ago")}`;

    return date.toLocaleDateString();
  }, [dateString, now, t]);

  return formattedDate;
}
