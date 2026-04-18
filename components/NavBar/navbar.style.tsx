import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const stylesNav = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
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
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    color: Colors.white,
    marginTop: 4,
  },
  activeLabel: {
    color: Colors.primaryLight,
    fontWeight: "bold",
    borderRadius: 8,
  },
});
