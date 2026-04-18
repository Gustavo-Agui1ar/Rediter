import { StyleSheet } from "react-native";
import { Colors } from "./theme";

export const stylesPerfil = StyleSheet.create({
  imageProfile: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.divider,
    objectFit: "contain",
  },

  containeractionprofile: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: -30,
    paddingHorizontal: 16,
  },
});
