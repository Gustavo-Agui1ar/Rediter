import { StyleSheet } from "react-native";

export const createdCodeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      width: "100%",
    },
    input: {
      width: "100%",
      borderWidth: 2,
      borderRadius: 4,
      textAlign: "center",
      color: colors.textPrimary,
      borderColor: colors.primary,
      fontSize: 24,
    },
  });
