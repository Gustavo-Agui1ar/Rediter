import React, { useCallback } from "react";
import { DeviceEventEmitter, View } from "react-native";
import {
  MaterialTabBar,
  MaterialTabItem,
  Tabs,
} from "react-native-collapsible-tab-view";

import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import { useTheme } from "@/context/ThemeContext";
import { useFeedStyles } from "./FeedProfile.style";

interface FeedProfileProps {
  headerComponent: React.ReactNode;
  onRefreshProfile: () => Promise<void>;
}

export default function FeedProfile({
  headerComponent,
  onRefreshProfile,
}: FeedProfileProps) {
  const styles = useFeedStyles();
  const { colors } = useTheme();

  const handleGlobalRefresh = async () => {
    await onRefreshProfile();
    DeviceEventEmitter.emit("refresh_posts");
    DeviceEventEmitter.emit("refresh_media");
  };

  const renderHeader = useCallback(
    () => <View style={styles.headerWrapper}>{headerComponent}</View>,
    [headerComponent, styles.headerWrapper],
  );

  return (
    <View style={styles.container}>
      <Tabs.Container
        renderHeader={renderHeader}
        renderTabBar={(props) => (
          <MaterialTabBar
            {...props}
            activeColor={colors.primary}
            inactiveColor={colors.textMuted}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            TabItemComponent={(itemProps) => (
              <MaterialTabItem
                {...itemProps}
                pressColor="transparent"
                pressOpacity={1}
              />
            )}
          />
        )}
      >
        <Tabs.Tab name="posts" label="Posts">
          <Posts />
        </Tabs.Tab>

        <Tabs.Tab name="media" label="Mídia">
          <Midiagrid isMyProfile={true} />
        </Tabs.Tab>

        <Tabs.Tab name="likes" label="Curtidas">
          <Posts />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
}
