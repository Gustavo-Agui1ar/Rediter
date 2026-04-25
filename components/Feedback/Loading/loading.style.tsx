import { StyleSheet } from "react-native";

export const createdLoadingStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(26, 15, 31, 0.3)",
      justifyContent: "center",
      alignItems: "center",

      zIndex: 999,
      elevation: 999,
    },

    activityIndicator: {
      color: colors.primary,
      transform: [{ scale: 2 }],
    },
  });
