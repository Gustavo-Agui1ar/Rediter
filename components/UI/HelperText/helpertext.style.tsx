import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const createHelperTextStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    text: {
      color: colors.error,
      fontSize: 12,
      paddingLeft: 10,
    },
  }),
);
