import { StyleSheet } from "react-native";

export const Colors = {
  primary: "#121417",
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
    flexGrow: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.primary,
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
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    paddingTop: 40,
    paddingBottom: 40,
  },

  content: {
    flexGrow: 0.8,
    width: "80%",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flex: 1,
    flexGrow: 0.2,
    width: "100%",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },

  title: {
    fontSize: TextSize.large,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: Colors.perimary,
  },

  subtitle: {
    fontSize: TextSize.medium,
    color: Colors.perimary,
  },

  logo: {
    width: 100,
    height: 100,
    objectFit: "contain" as const,
  },

  small_icon: {
    width: 40,
    height: 40,
  },

  medium_icon: {
    width: 80,
    height: 80,
  },

  large_icon: {
    width: 120,
    height: 120,
  },

  paragraph: {
    fontSize: TextSize.medium,
    color: Colors.perimary,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "justify",
  },

  keyboard_avoid: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 20,
    width: "100%",
  },

  scroll_view: {
    flex: 1,
    width: "100%",
  },

  key_board_avoid: {
    flex: 1,
    width: "100%",
  },

  scroll_content: {
    flexGrow: 1,
    gap: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});
