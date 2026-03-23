import { StyleSheet } from "react-native";

export const Colors = {
  primary: "  #12161d",
  secondary: "#4a1bcb",
  terciary: "#948979",
  quaternary: "#DFD0B8",
  perimary: "#ffffff",
};

export const TextSize = {
  small: 12,
  medium: 16,
  large: 24,
};

export const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  stretch: {
    alignSelf: "stretch",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: TextSize.large,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: Colors.perimary,
  },

  logo: {
    width: 150,
    height: 150,
  },
});
