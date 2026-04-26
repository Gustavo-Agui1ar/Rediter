import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesMain = makeStyles((colors: any) =>
  StyleSheet.create({
    footerContainer: {
      width: "100%",
      borderTopWidth: 1,
      borderColor: colors.divider,

      paddingBottom: 10,
      alignItems: "center",
      justifyContent: "center",
    },

    floatingButton: {
      position: "absolute",
      top: -68,
      left: "84%",
      alignSelf: "center",
    },
  }),
);
