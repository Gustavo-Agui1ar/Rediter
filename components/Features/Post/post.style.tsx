import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const postStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
    zIndex: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-around",
    zIndex: 1,
  },

  location: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.textMuted,
    marginTop: 4,
  },

  edited: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },

  username: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  image: {
    width: "100%",
    aspectRatio: 2,
    objectFit: "cover",
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

  itemOptionsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },

  itemOptionsContainerLast: {
    borderBottomWidth: 0,
  },
});
