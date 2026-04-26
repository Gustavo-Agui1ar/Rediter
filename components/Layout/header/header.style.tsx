import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesHeader = makeStyles((colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingTop: 20,
      backgroundColor: colors.background,
      gap: 12,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    left: {
      alignItems: "flex-start",
      justifyContent: "center",
    },
    center: {
      flex: 1,
      justifyContent: "center",
    },
    right: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    logo: {
      width: 32,
      height: 32,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
  }),
);
