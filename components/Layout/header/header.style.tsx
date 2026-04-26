import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesHeader = makeStyles((colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    left: {
      flex: 1,
      alignItems: "flex-start",
    },
    center: {
      flex: 2,
      alignItems: "center",
    },
    right: {
      flex: 1,
      alignItems: "flex-end",
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
