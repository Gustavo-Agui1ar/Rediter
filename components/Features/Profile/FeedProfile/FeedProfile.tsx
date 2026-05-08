import React, { useState } from "react";
import { DeviceEventEmitter, View } from "react-native";

import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useLoading } from "@/context/loadingContext";
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
  const [activeTab, setActiveTab] = useState("posts");
  const { setLoading, loading } = useLoading();

  const handleGlobalRefresh = async () => {
    setLoading(true);
    try {
      await onRefreshProfile();

      if (activeTab === "posts") {
        DeviceEventEmitter.emit("refresh_posts");
      } else if (activeTab === "media") {
        DeviceEventEmitter.emit("refresh_media");
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "media", label: "Mídia" },
    { id: "likes", label: "Curtidas" },
  ];

  const profileHeader = (
    <View style={styles.headerWrapper}>{headerComponent}</View>
  );
  const tabBarComponent = (
    <TabBar items={tabs} active={activeTab} onChange={setActiveTab} />
  );

  function renderContent() {
    switch (activeTab) {
      case "posts":
        return (
          <Posts
            myProfile={true}
            onRefresh={handleGlobalRefresh}
            refreshing={loading}
            profileHeader={profileHeader}
            tabBar={tabBarComponent}
          />
        );

      case "media":
        return (
          <Midiagrid
            isMyProfile={true}
            onRefresh={handleGlobalRefresh}
            refreshing={loading}
            profileHeader={profileHeader}
            tabBar={tabBarComponent}
          />
        );

      case "likes":
        return (
          <Posts
            myProfile={false}
            onRefresh={handleGlobalRefresh}
            refreshing={loading}
            profileHeader={profileHeader}
            tabBar={tabBarComponent}
          />
        );

      default:
        return null;
    }
  }

  return <View style={styles.container}>{renderContent()}</View>;
}
