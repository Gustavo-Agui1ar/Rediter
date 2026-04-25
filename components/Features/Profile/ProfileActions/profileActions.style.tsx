import { TextSize } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const createdProfileActionsStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      width: "100%",
      padding: 8,
      justifyContent: "space-between",
      alignItems: "center",
    },

    nameText: {
      fontSize: TextSize.lg,
      fontWeight: "600",
      color: colors.primaryLight,
    },

    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    followButton: {
      flex: 1,
      maxWidth: 140,
    },
  });
