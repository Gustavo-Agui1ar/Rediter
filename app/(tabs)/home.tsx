import { Header, SearchPosts } from "@/components/components";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useLanguage } from "@/context/LanguageContext";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";

export default function HomeFeedScreen() {
  const { colors } = useTheme();
  const { loading: globalLoading } = useLoading();
  const { t } = useLanguage();

  const feedTabs = useMemo(
    () => [
      { id: "following", label: t("tab_following") },
      { id: "foryou", label: t("tab_foryou") },
    ],
    [t],
  );

  const [activeTab, setActiveTab] = useState("following");

  function renderHeader() {
    return (
      <Header divider={false}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.textPrimary,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          Rediter
        </Text>
      </Header>
    );
  }

  function renderContent() {
    switch (activeTab) {
      case "following":
        return (
          <View style={{ flex: 1 }}>
            <SearchPosts
              key="tab-following"
              searchTerm=""
              refreshing={globalLoading}
              feedMode="following"
            />
          </View>
        );

      case "foryou":
        return (
          <View style={{ flex: 1 }}>
            <SearchPosts
              key="tab-foryou"
              searchTerm=""
              refreshing={globalLoading}
              feedMode="foryou"
            />
          </View>
        );

      default:
        return null;
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {renderHeader()}

      <TabBar items={feedTabs} active={activeTab} onChange={setActiveTab} />

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
