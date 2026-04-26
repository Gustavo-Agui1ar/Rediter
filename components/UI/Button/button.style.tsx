import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesButton = makeStyles((colors: any) =>
  StyleSheet.create({
    base: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      width: "100%",
      borderRadius: 8,
    },

    baseWithIcon: {
      paddingVertical: 16,
      paddingHorizontal: 20,
    },

    fill: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.primary,
    },

    remove_fill: {
      backgroundColor: colors.error,
      color: colors.onError,
      borderWidth: 2,
      borderColor: colors.error,
    },

    remove_border: {
      borderWidth: 2,
      borderColor: colors.error,
      backgroundColor: "transparent" as const,
    },

    border: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: "transparent" as const,
    },

    buttonText: {
      color: colors.white,
      textTransform: "uppercase" as const,
      textAlign: "center" as const,
      fontFamily: "sans-serif",
    },

    textBorder: {
      color: colors.primary,
    },

    textOnFill: {
      color: colors.white,
    },
    textRemove: {
      color: colors.error,
    },
  }),
);
