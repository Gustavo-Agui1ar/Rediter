import {
  Header,
  SearchPosts,
  SearchUser,
  TextBox,
} from "@/components/components";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useLanguage } from "@/context/LanguageContext";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { useSearch } from "@/scripts/Search.script";
import { useStyles } from "@/styles/search.styles";
import React from "react";
import { View } from "react-native";

export default function Search() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { state, actions } = useSearch();
  const { loading: globalLoading } = useLoading();
  const { t } = useLanguage();

  function renderHeader() {
    return (
      <Header divider={false}>
        <TextBox
          placeholder={t("search_placeholder")}
          value={state.searchQuery}
          onChangeText={actions.setSearchQuery}
          icon="search"
          style={{ width: "100%" }}
          editable={!globalLoading}
        />
      </Header>
    );
  }

  function renderContent() {
    switch (state.activeTab) {
      case "people":
        return (
          <View style={styles.postsContainer}>
            <SearchUser
              key={`tab-${state.activeTab}`}
              searchTerm={state.searchQuery}
              refreshing={globalLoading}
            />
          </View>
        );

      case "posts":
      case "media":
        return (
          <View style={styles.postsContainer}>
            <SearchPosts
              key={`tab-${state.activeTab}`}
              searchTerm={state.searchQuery}
              myProfile={false}
              refreshing={globalLoading}
              onlyWithMedia={state.activeTab === "media"}
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

      <TabBar
        items={state.tabs}
        active={state.activeTab}
        onChange={actions.setActiveTab}
      />

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
