import { useTheme } from "@/context/ThemeContext";
import { StyleSheet } from "react-native";

export const useStylesBlockedUsers = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    skeletonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E5E5E5",
    },
    skeletonAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface || "#E0E0E0",
    },
    skeletonName: {
      width: "40%",
      height: 18,
      borderRadius: 4,
      backgroundColor: colors.surface || "#E0E0E0",
      marginLeft: 16,
    },

    listContent: {
      flexGrow: 1,
      padding: 10,
      backgroundColor: colors.background,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 80,
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary || "#666666",
      textAlign: "center",
      lineHeight: 24,
    },

    footerLoading: {
      paddingVertical: 24,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
