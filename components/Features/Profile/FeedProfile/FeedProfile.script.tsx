import { useLoading } from "@/context/LoadingContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter } from "react-native";
export interface UseFeedProfileProps {
  onRefreshProfile: () => Promise<void>;
  refresh_id: string;
  activeTab: string;
}

export const useFeedProfile = (props: UseFeedProfileProps) => {
  const { onRefreshProfile, refresh_id } = props;
  const [activeTab, setActiveTab] = useState(props.activeTab || "posts");
  const { setLoading, loading } = useLoading();

  const [renderedTabs, setRenderedTabs] = useState({
    posts: true,
    media: false,
    likes: false,
  });

  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const handleGlobalRefresh = useCallback(async () => {
    setLoading(true);
    try {
      DeviceEventEmitter.emit(`${refresh_id}_${activeTabRef.current}`);
      await onRefreshProfile();
    } catch (error) {
      console.error("[handleGlobalRefresh ERROR]", error);
    } finally {
      setLoading(false);
    }
  }, [onRefreshProfile, refresh_id, setLoading]);

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
    setRenderedTabs((prev) => ({ ...prev, [newTab]: true }));
  }, []);

  return {
    state: {
      activeTab,
      loading,
      renderedTabs,
    },
    actions: {
      handleTabChange,
      handleGlobalRefresh,
    },
  };
};
