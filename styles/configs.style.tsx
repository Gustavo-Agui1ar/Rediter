import { StyleSheet } from "react-native";
import { Colors } from "./theme";

export const configsStyles = StyleSheet.create({
  imageFix: {
    alignItems: "center",
    marginBottom: 20,
    position: "absolute",
    top: 10,
  },

  iconButtonFix: {
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
  },

  contentTextFix: {
    gap: 25,
    marginTop: -40,
    width: "90%",
  },

  contentFix: {
    justifyContent: "flex-start",
  },

  coverOverlay: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 10,
  },

  profileImageOverlay: {
    alignItems: "flex-start",
    marginTop: -60,
    marginLeft: 20,
  },

  profileImageFix: {
    borderRadius: 60,
    overflow: "hidden",
    position: "relative",
    backgroundColor: Colors.background,
  },
});
