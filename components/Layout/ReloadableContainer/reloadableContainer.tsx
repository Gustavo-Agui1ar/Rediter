import { useTheme } from "@/context/ThemeContext";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

interface Props {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
}

export default function ReloadableContainer({ children, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const { colors } = useTheme();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {children}
    </ScrollView>
  );
}
