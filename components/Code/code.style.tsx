import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    color: Colors.textPrimary,
    borderColor: Colors.primary,
    fontSize: 24,
  },
});
