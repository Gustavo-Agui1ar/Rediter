import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 15, 31, 0.3)",
    justifyContent: "center",
    alignItems: "center",

    zIndex: 999,
    elevation: 999,
  },
});
