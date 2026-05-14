import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useTheme } from "@/context/ThemeContext";
import React, { useMemo } from "react";
import { ActivityIndicator, Animated, View } from "react-native";
import { useFeedProfile } from "./FeedProfile.script";
import { useFeedStyles } from "./FeedProfile.style";

interface FeedProfileProps {
  headerComponent: React.ReactElement;
  userId?: string;
  ownProfile: boolean;
  refresh_id: string;
  onRefreshProfile: () => Promise<void>;
}

export default function FeedProfile(props: FeedProfileProps) {
  const { headerComponent, userId, ownProfile, refresh_id } = props;
  const styles = useFeedStyles();
  const { colors } = useTheme();

  const { state, actions, animations, panHandlers, getTabStyle } =
    useFeedProfile({
      onRefreshProfile: props.onRefreshProfile,
      refresh_id: props.refresh_id,
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
            onChange={actions.handleTabChange}
          />
        </Animated.View>

        {state.renderedTabs.posts && (
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
        )}

        {state.renderedTabs.media && (
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
        )}

        {state.renderedTabs.likes && (
          <View
            style={getTabStyle("likes")}
            pointerEvents={state.activeTab === "likes" ? "auto" : "none"}
          >
            <Posts
              key="tab-likes"
              userId={userId}
              ownProfile={ownProfile}
              refresh_id={`${refresh_id}_likes`}
              onScroll={actions.onScrollEvent}
              headerHeight={state.HEADER_HEIGHT}
            />
          </View>
        )}
      </View>
    </View>
  );
}
