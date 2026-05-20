import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useMemo, useState } from "react";

const segundosEmMinuto = 60;
const segundosEmHora = 3600;
const segundosEmDia = 86400;

interface UseFormattedDateOptions {
  updateInterval?: number;
}

export function useFormattedDate(
  dateString: string,
  options?: UseFormattedDateOptions,
) {
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
    const date = new Date(dateString);

    const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

    if (diffInSeconds < segundosEmMinuto) {
      return `${diffInSeconds} ${t("seconds_ago")}`;
    }

    if (diffInSeconds < segundosEmHora) {
      return `${Math.floor(diffInSeconds / segundosEmMinuto)} ${t("minutes_ago")}`;
    }

    if (diffInSeconds < segundosEmDia) {
      return `${Math.floor(diffInSeconds / segundosEmHora)} ${t("hours_ago")}`;
    }

    if (diffInSeconds < segundosEmDia * 7) {
      return `${Math.floor(diffInSeconds / segundosEmDia)} ${t("days_ago")}`;
    }

    return date.toLocaleDateString();
  }, [dateString, now]);

  return formattedDate;
}
