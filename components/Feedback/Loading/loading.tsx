import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useLoadingStyles } from "./loading.style"; // O novo hook de estilos

export default function LoadingOverlay() {
  const styles = useLoadingStyles();
  const { colors } = useTheme();

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
