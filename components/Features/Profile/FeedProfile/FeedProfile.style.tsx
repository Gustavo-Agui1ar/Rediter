import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useFeedStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
    },
    navBarContainer: {
      width: "100%",
      minHeight: 50,
    },
    scrollContent: {
      paddingBottom: 16,
    },
    tabContainer: {
      flex: 1,
      width: "100%",
    },
    mediaContainer: {
      width: "100%",
      flex: 1,
      padding: 8,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    mediaItem: {
      width: "49%",
    },
    likesContainer: {
      width: "100%",
      padding: 16,
      flex: 1,
      gap: 16,
    },
  }),
);
