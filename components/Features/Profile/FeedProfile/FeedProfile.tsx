import React, { useCallback, useMemo, useState } from "react";
import { DeviceEventEmitter, View } from "react-native";

import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useLoading } from "@/context/loadingContext";
import { useFeedStyles } from "./FeedProfile.style";

interface FeedProfileProps {
  headerComponent: React.ReactNode;
  onRefreshProfile: () => Promise<void>;
  userId?: string;
  refresh_id: string;
  ownProfile?: boolean;
}

export default function FeedProfile({
  headerComponent,
  onRefreshProfile,
  userId,
  ownProfile = false,
  refresh_id,
}: FeedProfileProps) {
  const styles = useFeedStyles();

  const [activeTab, setActiveTab] = useState("posts");

  const { setLoading, loading } = useLoading();

  const handleGlobalRefresh = useCallback(async () => {
    setLoading(true);

    try {
      await onRefreshProfile();

      DeviceEventEmitter.emit(`${refresh_id}_${activeTab}`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, onRefreshProfile, refresh_id, setLoading]);

  const tabs = useMemo(
    () => [
      { id: "posts", label: "Posts" },
      { id: "media", label: "Mídia" },
      { id: "likes", label: "Curtidas" },
    ],
    [],
  );

  const profileHeader = useMemo(
    () => <View style={styles.headerWrapper}>{headerComponent}</View>,
    [headerComponent, styles.headerWrapper],
  );

  const tabBarComponent = useMemo(
    () => <TabBar items={tabs} active={activeTab} onChange={setActiveTab} />,
    [tabs, activeTab],
  );

  function renderContent() {
    switch (activeTab) {
      case "posts":
        return (
          <Posts
            userId={userId}
            ownProfile={ownProfile}
            onRefresh={handleGlobalRefresh}
            refreshing={loading}
            profileHeader={profileHeader}
            tabBar={tabBarComponent}
            refresh_id={`${refresh_id}_posts`}
          />
        );

      case "media":
        return (
          <Midiagrid
            userProfileId={userId}
            onRefresh={handleGlobalRefresh}
            refreshing={loading}
            profileHeader={profileHeader}
            tabBar={tabBarComponent}
            refresh_id={`${refresh_id}_media`}
          />
        );

      case "likes":
        return (
          <Posts
            userId={userId}
            ownProfile={ownProfile}
            onRefresh={handleGlobalRefresh}
            refreshing={loading}
            profileHeader={profileHeader}
            tabBar={tabBarComponent}
            refresh_id={`${refresh_id}_likes`}
          />
        );

      default:
        return null;
    }
  }

  return <View style={styles.container}>{renderContent()}</View>;
}
