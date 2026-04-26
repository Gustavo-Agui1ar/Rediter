import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useIndexStyle = makeStyles((colors: any) =>
  StyleSheet.create({
    content_login: {
      flex: 1,
      flexGrow: 0.7,
      width: "80%",
      gap: 20,
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
    },
  }),
);
