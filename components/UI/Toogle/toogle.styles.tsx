import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const createToggleStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    track: {
      width: 50,
      height: 28,
      borderRadius: 14,
      padding: 2,
      justifyContent: "center",
    },
    thumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.white,
      elevation: 2,
      shadowColor: colors.background,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
  }),
);
