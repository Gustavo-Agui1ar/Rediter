import { useState } from "react";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { id: "posts", label: "Mais Recentes" },
    { id: "people", label: "Pessoas" },
    { id: "media", label: "Mídias" },
  ];

  return {
    state: { searchQuery, activeTab, tabs },
    actions: { setSearchQuery, setActiveTab },
  };
}
