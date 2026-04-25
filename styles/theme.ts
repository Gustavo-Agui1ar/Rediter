import { StyleSheet } from "react-native";

/* ---------- DARK MODE (Ajustado) ---------- */
export const DarkColors = {
  /* Base - Agora com um subton azulado para alinhar com o Light */
  background: "#0D0E14",
  surface: "#161824",
  surfaceAlt: "#1F2233",

  /* Brand - Unificado com os tons da imagem */
  primary: "#6B66FF", // O mesmo azul vibrante
  primaryLight: "#8A85FF",
  primaryDark: "#4D49CC",

  /* Text */
  textPrimary: "#F0F0F7",
  textSecondary: "#A1A4C1",
  textMuted: "#6B6E8F",

  /* UI */
  border: "#2F334D",
  divider: "#25283D",

  /* States/Feedback - Mantendo consistência */
  disabled: "#3E4159",
  overlay: "rgba(0, 0, 0, 0.5)",
  success: "#2DC653",
  warning: "#F4A261",
  error: "#E63946",
  link: "#8A85FF",

  white: "#FFFFFF",
  black: "#000000",
};

/* ---------- LIGHT MODE (Ajustado) ---------- */
export const LightColors = {
  /* Base */
  background: "#F5F7FF",
  surface: "#FFFFFF",
  surfaceAlt: "#ECECFC",

  /* Brand - Exatamente iguais ao Dark para fixar a marca */
  primary: "#6B66FF",
  primaryLight: "#8A85FF",
  primaryDark: "#4D49CC",

  /* Text */
  textPrimary: "#151621",
  textSecondary: "#52547D",
  textMuted: "#8E91B5",

  /* UI */
  border: "#D1D5F0",
  divider: "#E2E5F8",

  /* States/Feedback */
  disabled: "#C8CADA",
  overlay: "rgba(0, 0, 0, 0.2)",
  success: "#28A745", // Leve ajuste de brilho
  warning: "#E67E22",
  error: "#DC3545",
  link: "#4C49ED",

  white: "#FFFFFF",
  black: "#000000",
};

/* ---------- TYPOGRAPHY ---------- */
export const TextSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

/* ---------- GLOBAL STYLES ---------- */
export const createdStyles = (colors: any) =>
  StyleSheet.create({
    /* Layout */
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: colors.background,
    },

    content: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      gap: 32,
    },

    scroll_content: {
      flexGrow: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },

    /* Flex helpers */
    fill: {
      flex: 1,
      width: "100%",
    },

    stretch: {
      alignSelf: "stretch",
    },

    center: {
      justifyContent: "center",
      alignItems: "center",
    },

    centerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },

    /* Text */
    title: {
      fontSize: TextSize.xl,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    subtitle: {
      fontSize: TextSize.md,
      color: colors.textSecondary,
    },

    paragraph: {
      fontSize: TextSize.md,
      color: colors.textSecondary,
      textAlign: "justify",
      marginVertical: 8,
    },

    textCenter: {
      textAlign: "center",
      color: colors.textPrimary,
    },

    /* UI blocks */
    base: {
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    disabled: {
      opacity: 0.6,
    },

    /* Footer */
    footer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 16,
    },

    /* Icons */
    icon_sm: {
      width: 40,
      height: 40,
    },

    icon_md: {
      width: 80,
      height: 80,
    },

    icon_lg: {
      width: 120,
      height: 120,
    },

    logo: {
      width: 100,
      height: 100,
      objectFit: "contain" as const,
    },

    /* Floating menu */
    editorContainer: {
      position: "absolute",
      top: 30,
      right: 0,
      minWidth: 180,

      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 6,

      borderWidth: 1,
      borderColor: colors.border,

      elevation: 5,
      shadowColor: colors.black,
      shadowOpacity: 0.25,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },

      zIndex: 99,
    },
  });
