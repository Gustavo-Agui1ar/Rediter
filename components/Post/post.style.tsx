import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const postStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  username: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },

  container: {
    width: "100%",
    padding: 16,
    borderColor: Colors.divider,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },

  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingVertical: 8,
  },
});
