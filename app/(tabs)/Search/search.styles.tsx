import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStyles = makeStyles((colors: ThemeColors) => ({
  personCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  textTitle: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: "bold",
  },
  textSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },

  tabBar: {
    backgroundColor: colors.background,
    paddingBottom: 24,
  },
  tabIndicator: {
    backgroundColor: colors.primaryDark,
  },
}));
