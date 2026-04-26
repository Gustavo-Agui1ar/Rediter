import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useLinkTextStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    link: {
      color: colors.link,
      fontSize: 14,
    },
  }),
);
