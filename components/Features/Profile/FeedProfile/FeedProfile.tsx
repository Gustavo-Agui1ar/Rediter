import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { ActivityIndicator, View } from "react-native";

// 1. Importamos o MaterialTabBar direto da biblioteca
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";

import { useFeedProfile } from "./FeedProfile.script";
import { useFeedStyles } from "./FeedProfile.style";

interface FeedProfileProps {
  headerComponent: React.ReactNode;
  userId?: string;
  ownProfile: boolean;
  refresh_id: string;
  onRefreshProfile: () => Promise<void>;
}

export default function FeedProfile(props: FeedProfileProps) {
  const { headerComponent, userId, ownProfile, refresh_id, onRefreshProfile } =
    props;

  const styles = useFeedStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const { state, actions } = useFeedProfile({
    onRefreshProfile,
    refresh_id,
    activeTab: "posts",
  });

  const renderHeader = () => (
    <View
      style={[
        styles.headerWrapper,
        { backgroundColor: colors.background || "#121212" },
      ]}
    >
      {state.loading && (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.customSpinner}
        />
      )}
      {headerComponent}
    </View>
  );

  return (
    <View style={styles.container}>
      <Tabs.Container
        renderHeader={renderHeader}
        onTabChange={({ tabName }) => {
          actions.handleTabChange(tabName as string);
        }}
        renderTabBar={(props) => (
          <MaterialTabBar
            {...props}
            activeColor={colors.primary}
            inactiveColor="#888888"
            indicatorStyle={{ backgroundColor: colors.primary, height: 2 }}
            style={{ backgroundColor: colors.background || "#121212" }}
            labelStyle={{ fontWeight: "bold", fontSize: 14 }}
          />
        )}
      >
        <Tabs.Tab name="posts" label={t("tab_posts")}>
          <Posts
            userId={userId}
            ownProfile={ownProfile}
            refresh_id={`${refresh_id}_posts`}
          />
        </Tabs.Tab>

        <Tabs.Tab name="media" label={t("tab_media")}>
          <Midiagrid
            userProfileId={userId}
            onRefresh={actions.handleGlobalRefresh}
            refreshing={state.loading}
            refresh_id={`${refresh_id}_media`}
          />
        </Tabs.Tab>

        <Tabs.Tab name="likes" label={t("tab_likes")}>
          <Posts
            userId={userId}
            ownProfile={false}
            onlyLiked={true}
            refresh_id={`${refresh_id}_likes`}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
}
