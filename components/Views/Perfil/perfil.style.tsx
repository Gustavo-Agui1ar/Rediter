import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesPerfil = makeStyles((colors: any) =>
  StyleSheet.create({
    header: {
      width: "100%",
      backgroundColor: colors.surface,
    },

    avatarWrapper: {
      position: "absolute",
      bottom: -60,
      left: 20,
      alignSelf: "center",
    },

    actionsContainer: {
      marginTop: 70,
      paddingHorizontal: 16,
      width: "100%",
    },

    feedContainer: {
      width: "100%",
      marginTop: 10,
    },
  }),
);
