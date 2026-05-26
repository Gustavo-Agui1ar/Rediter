import { useLoading } from "@/context/LoadingContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  DeviceEventEmitter,
  PanResponder,
  ViewStyle,
} from "react-native";

export interface UseFeedProfileProps {
  onRefreshProfile: () => Promise<void>;
  refresh_id: string;
  activeTab: string;
}

export const useFeedProfile = (props: UseFeedProfileProps) => {
  const { onRefreshProfile, refresh_id } = props;

  const [activeTab, setActiveTab] = useState("posts");
  const { setLoading, loading } = useLoading();
  const [renderedTabs, setRenderedTabs] = useState({
    posts: true,
    media: false,
    likes: false,
  });

  const HEADER_HEIGHT = 380;

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerPullY = useRef(new Animated.Value(0)).current;
  const spinnerVisibility = useRef(new Animated.Value(0)).current;

  const loadingRef = useRef(loading);
  const activeTabRef = useRef(activeTab);

  const handleGlobalRefresh = useCallback(async () => {
    setLoading(true);
    try {
      await onRefreshProfile();
      DeviceEventEmitter.emit(`${refresh_id}_${activeTabRef.current}`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, onRefreshProfile, refresh_id, setLoading]);

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
    setRenderedTabs((prev) => ({ ...prev, [newTab]: true }));
  }, []);

  useEffect(() => {
    loadingRef.current = loading;
    activeTabRef.current = activeTab;
  }, [loading, activeTab]);

  useEffect(() => {
    Animated.spring(spinnerVisibility, {
      toValue: loading ? 1 : 0,
      useNativeDriver: true,
      speed: 12,
    }).start();
  }, [loading]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // @ts-ignore
        const currentScroll = scrollY._value;
        return currentScroll <= 0 && gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (!loadingRef.current) {
          headerPullY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 70 && !loadingRef.current) {
          handleGlobalRefresh();
        }
        Animated.spring(headerPullY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 10,
        }).start();
      },
    }),
  ).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const pullAmount = scrollY.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerPullAmount = headerPullY.interpolate({
    inputRange: [0, 70],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const combinedSpinnerValue = Animated.add(
    Animated.add(pullAmount, spinnerVisibility),
    headerPullAmount,
  );

  const spinnerStyle = {
    opacity: combinedSpinnerValue.interpolate({
      inputRange: [0, 1, 3],
      outputRange: [0, 1, 1],
      extrapolate: "clamp",
    }),
    transform: [
      {
        translateY: combinedSpinnerValue.interpolate({
          inputRange: [0, 1, 3],
          outputRange: [0, 50, 50],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const getTabStyle = useCallback(
    (tabName: string): ViewStyle => {
      if (activeTab === tabName) return { flex: 1, paddingTop: 28 };
      return {
        position: "absolute",
        opacity: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      };
    },
    [activeTab],
  );

  const onScrollEvent = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true },
  );

  return {
    state: { activeTab, loading, renderedTabs, HEADER_HEIGHT },
    actions: { handleTabChange, handleGlobalRefresh, onScrollEvent },
    animations: { headerTranslateY, spinnerStyle },
    panHandlers: panResponder.panHandlers,
    getTabStyle,
  };
};
