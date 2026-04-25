import { TextSize } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const createdStylesHeader = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: 64,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: 16,
      backgroundColor: colors.surface,
    },

    divider: {
      borderBottomWidth: 1,
      borderColor: colors.border,
    },

    left: {
      width: 60,
      justifyContent: "center",
      alignItems: "flex-start",
    },

    center: {
      flex: 1,
      alignItems: "center",
    },

    right: {
      width: 60,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    logo: {
      width: 32,
      height: 32,
    },

    title: {
      fontSize: TextSize.md,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
