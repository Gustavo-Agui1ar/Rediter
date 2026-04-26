import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesPosts = makeStyles((colors: any) =>
  StyleSheet.create({
    listContent: {
      padding: 16,
      flexGrow: 1,
      gap: 16,
    },
    footerLoading: {
      paddingVertical: 20,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 50,
      color: colors.textMuted,
      fontSize: 16,
      fontWeight: "bold",
    },
  }),
);
