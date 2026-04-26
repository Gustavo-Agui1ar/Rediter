import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesProfileCover = makeStyles((colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      aspectRatio: 2,
      backgroundColor: colors.divider,
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    avatarWrapper: {
      position: "absolute",
      bottom: -60,
      left: 20,
    },
  }),
);
