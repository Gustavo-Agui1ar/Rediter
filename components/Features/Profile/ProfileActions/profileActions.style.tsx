import { TextSize } from "@/styles/global.styles";
import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useProfileActionsStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    width: "100%",
    paddingBottom: 8,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    gap: 16,
    marginTop: -42,
    marginBottom: 12,
    zIndex: 10,
    elevation: 10,
  },

  followButton: {
    maxWidth: 100,
    height: 36,
    borderRadius: 18,
  },

  nameText: {
    paddingHorizontal: 16,
    fontSize: TextSize.lg,
    fontWeight: "bold",
    color: colors.primaryLight,
  },

  descriptionContainer: {
    marginTop: 8,
    width: "100%",
    paddingHorizontal: 16,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },
}));
