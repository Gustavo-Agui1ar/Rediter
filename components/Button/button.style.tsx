import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 8,
  },

  baseWithIcon: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  fill: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  border: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: "transparent" as const,
  },

  buttonText: {
    color: Colors.white,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
    fontFamily: "sans-serif",
  },

  textBorder: {
    color: Colors.white,
  },
});
