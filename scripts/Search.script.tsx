import { useLanguage } from "@/context/LanguageContext";
import { useMemo, useState } from "react";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const { t } = useLanguage();

  const tabs = useMemo(
    () => [
      { id: "posts", label: t("tab_search_recent") },
      { id: "people", label: t("tab_search_people") },
      { id: "media", label: t("tab_search_media") },
    ],
    [t],
  );

  return {
    state: { searchQuery, activeTab, tabs },
    actions: { setSearchQuery, setActiveTab },
  };
}
