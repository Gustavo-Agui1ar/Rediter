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
    width: 50,
    height: 55,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    color: Colors.perimary,
    borderColor: Colors.secondary,
    fontSize: 20,
  },
});
