import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useLoadingStyles = makeStyles((colors: ThemeColors) => ({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(26, 15, 31, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },

  activityIndicator: {
    transform: [{ scale: 2 }],
  },
}));
