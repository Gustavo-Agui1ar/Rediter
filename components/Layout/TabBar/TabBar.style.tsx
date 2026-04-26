import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useTabBarStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },

  label: {
    color: colors.textMuted,
  },

  activeLabel: {
    color: colors.primary,
    fontWeight: "600",
  },

  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
}));
