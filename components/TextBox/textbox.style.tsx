import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const textboxStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: Colors.primaryLight,
  },
  base: {
    height: 45,
    color: Colors.white,
  },
});
