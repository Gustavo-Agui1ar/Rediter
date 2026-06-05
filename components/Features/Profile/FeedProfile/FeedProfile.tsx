import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useFeedProfile } from "./FeedProfile.script";
import { useFeedStyles } from "./FeedProfile.style";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const REFRESH_THRESHOLD = 80;
const MAX_PULL_DISTANCE = 150;

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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullOffset = useSharedValue(0);
  const isRefreshingSV = useSharedValue(false);
  const isLoadingSV = useSharedValue(state.loading);

  useEffect(() => {
    isLoadingSV.value = state.loading;
  }, [state.loading, isLoadingSV]);

  const handleRefreshTrigger = async () => {
    isRefreshingSV.value = true;
    setIsRefreshing(true);

    await actions.handleGlobalRefresh();

    setIsRefreshing(false);
    isRefreshingSV.value = false;
    pullOffset.value = withTiming(0, { duration: 300 });
  };

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onUpdate((event) => {
        if (isRefreshingSV.value || isLoadingSV.value) return;

        if (event.translationY > 0) {
          pullOffset.value = interpolate(
            event.translationY,
            [0, WINDOW_HEIGHT / 2],
            [0, MAX_PULL_DISTANCE],
            Extrapolate.CLAMP,
          );
        }
      })
      .onEnd(() => {
        if (isRefreshingSV.value || isLoadingSV.value) return;

        if (pullOffset.value >= REFRESH_THRESHOLD) {
          pullOffset.value = withTiming(REFRESH_THRESHOLD);
          runOnJS(handleRefreshTrigger)();
        } else {
          pullOffset.value = withTiming(0);
        }
      });
  }, [pullOffset, isRefreshingSV, isLoadingSV]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: pullOffset.value }] };
  });

  const animatedSpinnerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      pullOffset.value,
      [0, REFRESH_THRESHOLD / 2, REFRESH_THRESHOLD],
      [0, 0.5, 1],
      Extrapolate.CLAMP,
    );
    return {
      opacity: opacity,
      transform: [{ scale: opacity }],
    };
  });

  const renderHeader = useCallback(
    () => (
      <GestureDetector gesture={panGesture}>
        <View
          style={[
            styles.headerWrapper,
            { backgroundColor: colors.background || "#121212" },
          ]}
        >
          {headerComponent}
        </View>
      </GestureDetector>
    ),
    [panGesture, styles.headerWrapper, colors.background, headerComponent],
  );

  const renderTabBar = useCallback(
    (props: any) => (
      <MaterialTabBar
        {...props}
        activeColor={colors.primary}
        inactiveColor="#888888"
        indicatorStyle={{ backgroundColor: colors.primary, height: 2 }}
        style={{ backgroundColor: colors.background || "#121212" }}
        labelStyle={{ fontWeight: "bold", fontSize: 14 }}
      />
    ),
    [colors.primary, colors.background],
  );

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        { backgroundColor: colors.background || "#121212" },
      ]}
    >
      <View style={localStyles.spinnerContainer}>
        {!isRefreshing && !state.loading ? (
          <Animated.View style={animatedSpinnerStyle}>
            <ActivityIndicator size="small" color={colors.primary} />
          </Animated.View>
        ) : (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
      </View>

      <Animated.View
        style={[
          {
            flex: 1,
            zIndex: 2,
            backgroundColor: colors.background || "#121212",
          },
          animatedContainerStyle,
        ]}
      >
        <Tabs.Container
          renderHeader={renderHeader}
          onTabChange={({ tabName }) => {
            actions.handleTabChange(tabName as string);
          }}
          renderTabBar={renderTabBar}
        >
          <Tabs.Tab name="posts" label={t("tab_posts")}>
            <Posts
              userId={userId}
              refresh_id={`${refresh_id}_posts`}
              headerHeight={styles.headerWrapper.height}
              shouldFetch={state.renderedTabs.posts}
            />
          </Tabs.Tab>

          <Tabs.Tab name="media" label={t("tab_media")}>
            <Midiagrid
              userProfileId={userId}
              refresh_id={`${refresh_id}_media`}
              // shouldFetch={state.renderedTabs.media}
            />
          </Tabs.Tab>

          <Tabs.Tab name="likes" label={t("tab_likes")}>
            <Posts
              userId={userId}
              onlyLiked={true}
              refresh_id={`${refresh_id}_likes`}
              headerHeight={styles.headerWrapper.height}
              shouldFetch={state.renderedTabs.likes}
            />
          </Tabs.Tab>
        </Tabs.Container>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const localStyles = StyleSheet.create({
  spinnerContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
