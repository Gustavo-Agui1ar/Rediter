// FeedProfile.style.ts
import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useFeedStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: colors.background,
    },
    headerWrapper: {
      backgroundColor: colors.background,
    },
    tabBar: {
      backgroundColor: colors.background,
      paddingBottom: 24,
    },
    tabIndicator: {
      backgroundColor: colors.primary,
    },
    navBarContainer: {
      width: "100%",
      minHeight: 50,
    },
    tabContainer: {
      flex: 1,
      width: "100%",
    },
  }),
);
