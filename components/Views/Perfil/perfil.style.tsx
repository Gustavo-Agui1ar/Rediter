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
      paddingHorizontal: 8,
      width: "100%",
    },

    feedContainer: {
      flex: 1,
      width: "100%",
    },
  }),
);
