import { StyleSheet } from "react-native";
import { Colors } from "./theme";

export const configsStyles = StyleSheet.create({
  imageFix: {
    alignItems: "center",
    marginBottom: 20,
    position: "absolute",
    top: 10,
  },

  label: {
    fontSize: 16,
    color: Colors.textMuted,
  },

  iconButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
