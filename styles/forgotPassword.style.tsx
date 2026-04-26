import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesForgotPassword = makeStyles((colors: any) =>
  StyleSheet.create({
    content: {
      flex: 1,
      flexGrow: 0.4,
      width: "80%",
      gap: 20,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);
