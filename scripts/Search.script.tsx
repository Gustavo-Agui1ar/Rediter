import { useLanguage } from "@/context/LanguageContext";
import { useCallback, useMemo, useState } from "react";

export function useSearch() {
  const [activeTab, setActiveTab] = useState("posts");
  const { t } = useLanguage();

  const tabs = useMemo(
    () => [
      { id: "posts", label: t("tab_search_recent") },
      { id: "people", label: t("tab_search_people") },
      { id: "media", label: t("tab_media") },
    ],
    [t],
  );

  const handleSetTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return {
    state: { activeTab, tabs },
    actions: { setActiveTab: handleSetTab },
  };
}
