import { StyleSheet } from "react-native";

export const createHelperTextStyles = (colors: any) =>
  StyleSheet.create({
    text: {
      color: colors.error,
      fontSize: 12,
      paddingLeft: 10,
    },
  });
