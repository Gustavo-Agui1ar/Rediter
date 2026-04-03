import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const stylesNav = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#333",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 12,
    color: Colors.perimary,
    marginTop: 4,
  },
  activeLabel: {
    color: "#FFF",
    fontWeight: "bold",
    borderRadius: 8,
  },
});
