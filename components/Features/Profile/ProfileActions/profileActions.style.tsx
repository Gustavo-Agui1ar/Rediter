import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 10,
  },
  nameContainer: {
    flex: 1,
    marginTop: 8,
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryLight,
    flexWrap: "wrap",
  },
  buttonWrapper: {
    flex: 1,
    marginRight: 10,
  },
});
