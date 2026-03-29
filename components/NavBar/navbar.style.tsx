import { StyleSheet } from "react-native";

export const stylesNav = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#1A1A1A", // Exemplo de cor do Rediter
    borderTopWidth: 1,
    borderTopColor: "#333",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  activeIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  activeLabel: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
