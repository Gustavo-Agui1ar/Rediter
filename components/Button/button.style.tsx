import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: "100%",
  },

  fill: {
    backgroundColor: Colors.secondary,
  },

  border: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    backgroundColor: "transparent" as const,
  },

  buttonText: {
    color: Colors.perimary,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
    fontFamily: "sans-serif",
  },

  textBorder: {
    color: Colors.perimary,
  },
});
