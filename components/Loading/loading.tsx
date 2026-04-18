import { Colors } from "@/styles/theme";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./loading.style";

export function LoadingOverlay() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={{ transform: [{ scale: 2 }] }}
      />
    </View>
  );
}
