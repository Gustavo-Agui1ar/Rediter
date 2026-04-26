import { TextSize } from "@/styles/global.styles";
import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useNavStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingVertical: 6,
    },
    navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingVertical: 6,
    },
    iconContainer: {
      padding: 6,
      borderRadius: 12,
    },
    activeIcon: {
      borderRadius: 8,
      backgroundColor: colors.primaryDark,
    },
    label: {
      fontSize: TextSize.xs,
    },
  }),
);
