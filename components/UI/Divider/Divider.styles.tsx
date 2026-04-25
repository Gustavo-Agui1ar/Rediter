import { StyleSheet } from "react-native";

export const createDividerStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
      width: "100%",
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },

    text: {
      marginHorizontal: 10,
      color: colors.textMuted,
      fontSize: 14,
    },
  });
