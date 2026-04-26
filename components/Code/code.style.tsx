import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useCodeStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      width: "100%",
    },
    input: {
      width: "100%",
      borderWidth: 2,
      borderRadius: 4,
      textAlign: "center",
      color: colors.textPrimary,
      borderColor: colors.primary,
      fontSize: 24,
    },
  }),
);
