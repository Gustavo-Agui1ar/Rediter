import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useTheme } from "@/context/ThemeContext";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  View,
} from "react-native";
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

  const { state, actions, animations, panHandlers, getTabStyle } =
    useFeedProfile({
      onRefreshProfile: onRefreshProfile,
      refresh_id: refresh_id,
      activeTab: "",
    });

  const tabs = useMemo(
    () => [
      { id: "posts", label: "Posts" },
      { id: "media", label: "Mídia" },
      { id: "likes", label: "Curtidas" },
    ],
    [],
  );

  const renderedPostsTab = useMemo(() => {
    if (!state.renderedTabs.posts) return null;
    return (
      <View
        style={getTabStyle("posts")}
        pointerEvents={state.activeTab === "posts" ? "auto" : "none"}
      >
        <Posts
          key="tab-posts"
          userId={userId}
          ownProfile={ownProfile}
          refresh_id={`${refresh_id}_posts`}
          onScroll={actions.onScrollEvent}
          headerHeight={state.HEADER_HEIGHT + 24}
        />
      </View>
    );
  }, [
    state.renderedTabs.posts,
    state.activeTab,
    getTabStyle,
    userId,
    ownProfile,
    refresh_id,
    actions.onScrollEvent,
    state.HEADER_HEIGHT,
  ]);

  const renderedMediaTab = useMemo(() => {
    if (!state.renderedTabs.media) return null;
    return (
      <View
        style={getTabStyle("media")}
        pointerEvents={state.activeTab === "media" ? "auto" : "none"}
      >
        <Midiagrid
          key="tab-media"
          userProfileId={userId}
          onRefresh={actions.handleGlobalRefresh}
          refreshing={state.loading}
          refresh_id={`${refresh_id}_media`}
          onScroll={actions.onScrollEvent}
          headerHeight={state.HEADER_HEIGHT + 10}
        />
      </View>
    );
  }, [
    state.renderedTabs.media,
    state.activeTab,
    getTabStyle,
    userId,
    actions.handleGlobalRefresh,
    state.loading,
    refresh_id,
    actions.onScrollEvent,
    state.HEADER_HEIGHT,
  ]);

  const renderedLikesTab = useMemo(() => {
    if (!state.renderedTabs.likes) return null;
    return (
      <View
        style={getTabStyle("likes")}
        pointerEvents={state.activeTab === "likes" ? "auto" : "none"}
      >
        <Posts
          key="tab-likes"
          userId={userId}
          ownProfile={false}
          onlyLiked={true}
          refresh_id={`${refresh_id}_likes`}
          onScroll={actions.onScrollEvent}
          headerHeight={state.HEADER_HEIGHT}
        />
      </View>
    );
  }, [
    state.renderedTabs.likes,
    state.activeTab,
    getTabStyle,
    userId,
    ownProfile,
    refresh_id,
    actions.onScrollEvent,
    state.HEADER_HEIGHT,
  ]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, position: "relative" }}>
        <Animated.View
          {...panHandlers}
          style={[
            styles.headerAnimatedContainer,
            {
              transform: [{ translateY: animations.headerTranslateY }],
              backgroundColor: colors.background || "#121212",
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.customSpinner, animations.spinnerStyle]}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </Animated.View>

          <View style={styles.headerWrapper}>{headerComponent}</View>

          <TabBar
            items={tabs}
            active={state.activeTab}
            onChange={(tabId) => {
              actions.handleTabChange(tabId);

              DeviceEventEmitter.emit(`scrollToTop_${refresh_id}_${tabId}`);
            }}
          />
        </Animated.View>

        {renderedPostsTab}
        {renderedMediaTab}
        {renderedLikesTab}
      </View>
    </View>
  );
}
