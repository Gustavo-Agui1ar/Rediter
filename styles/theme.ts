import { StyleSheet } from "react-native";

export const Colors = {
  // Base
  background: "#0D0F14",
  surface: "#151821",
  surfaceAlt: "#1C1F2B",

  // Brand (roxo principal)
  primary: "#5A189A",
  primaryLight: "#8c2fde",
  primaryDark: "#34085d",

  // Texto
  textPrimary: "#FFFFFF",
  textSecondary: "#C9C9D1",
  textMuted: "#8F90A6",

  // Bordas / separadores
  border: "#2A2E3D",
  divider: "#232634",

  // Estados
  disabled: "#4A4D5A",
  overlay: "rgba(0,0,0,0.4)",

  // Feedback (já deixa pronto pro futuro)
  success: "#2DC653",
  warning: "#F4A261",
  error: "#E63946",

  //Links
  link: "#1DA1F2",

  // Extras neutros
  white: "#FFFFFF",
  black: "#000000",
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
  disabledOverlay: {
    opacity: 0.6,
    backgroundColor: Colors.disabled,
    color: Colors.white,
  },
  TextAlignCenter: {
    textAlign: "center",
    color: Colors.white,
  },

  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    width: "100%",
    gap: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    aspectRatio: 4,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: TextSize.large,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: Colors.white,
  },

  subtitle: {
    fontSize: TextSize.medium,
    color: Colors.white,
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
    color: Colors.white,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "justify",
  },

  container: {
    flex: 1,
    width: "100%",
  },

  scroll_content: {
    flexGrow: 1,
    gap: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
