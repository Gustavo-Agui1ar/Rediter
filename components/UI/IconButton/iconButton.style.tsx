import { StyleSheet } from "react-native";

export type IconButtonType = "border" | "fill" | "none" | "overlay";

export const getIconColorByType = (colors: any) => ({
  border: colors.primary,
  fill: colors.primaryLight,
  none: colors.textPrimary,
  overlay: colors.white,
});

export const createIconButtonStyles = (colors: any) =>
  StyleSheet.create({
    base: {
      alignItems: "center",
      justifyContent: "center",
    },

    border: {
      borderWidth: 2.5,
      borderColor: colors.primary,
    },

    fill: {
      backgroundColor: colors.primaryDark,
    },

    none: {
      backgroundColor: "transparent",
    },

    overlay: {
      backgroundColor: colors.overlay,
    },

    disabled: {
      opacity: 0.5,
    },
  });
