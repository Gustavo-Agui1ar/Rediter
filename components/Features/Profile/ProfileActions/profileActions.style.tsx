import { TextSize } from "@/styles/global.styles";
import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useProfileActionsStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    flex: 1,
    width: "100%",
  },

  row: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },

  nameText: {
    fontSize: TextSize.lg,
    fontWeight: "600",
    color: colors.primaryLight,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  followButton: {
    flex: 1,
    maxWidth: 140,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 24,
    paddingTop: 16,
    paddingRight: 16,
    textAlign: "justify" as const,
  },
}));
