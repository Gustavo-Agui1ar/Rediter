import { useTheme } from "@/context/ThemeContext";
import { StyleSheet } from "react-native";

export function usePostDetailsStyles() {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    headerText: {
      marginLeft: 12,
      justifyContent: "center",
      flexShrink: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      maxWidth: "85%",
    },
    timeText: {
      fontSize: 14,
      color: colors.disabled,
      marginTop: 2,
    },
    postText: {
      fontSize: 18,
      color: colors.textPrimary,
      lineHeight: 26,
      marginBottom: 16,
      marginLeft: 8,
    },
    imageContainer: {
      marginBottom: 16,
      borderRadius: 12,
      overflow: "hidden",
    },
    locationBadge: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    locationText: {
      color: colors.primary,
      fontSize: 14,
      marginLeft: 6,
      flexShrink: 1,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 8,
    },
    actionGroup: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    statText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    notFound: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 60,
    },
    notFoundText: {
      color: colors.primary,
      fontSize: 16,
    },
    followButtonWrapper: {
      flex: 1,
      maxHeight: 36,
      maxWidth: 92,
      overflow: "hidden",
      justifyContent: "center",
      marginLeft: "auto",
    },
  });
}
