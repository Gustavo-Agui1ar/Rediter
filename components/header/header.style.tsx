import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const stylesHeader = StyleSheet.create({
  header: {
    aspectRatio: 2.5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
});
