import { useTheme } from "@/context/ThemeContext";
import { ActivityIndicator, View } from "react-native";
import { useLoadingStyles } from "./loading.style";

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
