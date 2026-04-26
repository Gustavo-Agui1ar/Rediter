import { makeStyles } from "@/utils/makeStyles.utils";
import { ThemeColors } from "./types/theme.types";

/* ---------- TYPOGRAPHY ---------- */
export const TextSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

/* ---------- GLOBAL STYLES ---------- */
export const useGlobalStyles = makeStyles((colors: ThemeColors) => ({
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
}));
