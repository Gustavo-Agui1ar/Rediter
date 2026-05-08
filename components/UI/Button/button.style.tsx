import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesButton = makeStyles((colors: ThemeColors) => ({
  base: {
    flexDirection: "row" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  small: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  medium: {
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  large: {
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  baseWithIcon: {
    paddingHorizontal: 20,
  },

  fill: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  fillPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },

  border: {
    backgroundColor: "transparent" as const,
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },

  borderPressed: {
    backgroundColor: `${colors.primary}15`,
  },

  remove_fill: {
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.error,
  },

  remove_fillPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  remove_border: {
    backgroundColor: "transparent" as const,
    borderWidth: 2,
    borderColor: colors.error,
    elevation: 0,
    shadowOpacity: 0,
  },

  remove_borderPressed: {
    backgroundColor: `${colors.error}15`,
  },

  disabled: {
    opacity: 0.5,
  },

  buttonText: {
    fontWeight: "700" as const,
    letterSpacing: 0.5,
    textAlign: "center" as const,
    textTransform: "uppercase" as const,
    fontFamily: "sans-serif",
  },

  textSmall: { fontSize: 12 },
  textMedium: { fontSize: 14 },
  textLarge: { fontSize: 16 },

  textOnFill: { color: colors.white },
  textBorder: { color: colors.primary },
  textRemove: { color: colors.error },

  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
}));
