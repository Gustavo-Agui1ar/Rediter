import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createdLoadingStyles } from "./loading.style";

export default function LoadingOverlay() {
  const { colors } = useTheme();
  const styles = createdLoadingStyles(colors);

  return (
    <View style={styles.overlay}>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.activityIndicator}
      />
    </View>
  );
}
