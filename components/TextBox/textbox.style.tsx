import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const textboxStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    borderColor: Colors.primaryLight,
  },

  base: {
    width: "100%",
  },
});
