import React, { useCallback, useState } from "react";
import { DeviceEventEmitter, View } from "react-native";

import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import TabBar from "@/components/Layout/TabBar/TabBar";
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

  const [activeTab, setActiveTab] = useState("posts");

  const handleGlobalRefresh = async () => {
    await onRefreshProfile();
    DeviceEventEmitter.emit("refresh_posts");
    DeviceEventEmitter.emit("refresh_media");
  };

  const renderHeader = useCallback(
    () => <View style={styles.headerWrapper}>{headerComponent}</View>,
    [headerComponent, styles.headerWrapper],
  );

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "media", label: "Mídia" },
    { id: "likes", label: "Curtidas" },
  ];

  function renderContent() {
    switch (activeTab) {
      case "posts":
        return (
          <View style={styles.tabItemContainer}>
            <Posts myProfile={true} />
          </View>
        );

      case "media":
        return (
          <View style={styles.tabItemContainer}>
            <Midiagrid isMyProfile={true} />
          </View>
        );

      case "likes":
        return (
          <View style={styles.tabItemContainer}>
            <Posts myProfile={false} />
          </View>
        );

      default:
        return null;
    }
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <TabBar items={tabs} active={activeTab} onChange={setActiveTab} />

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
