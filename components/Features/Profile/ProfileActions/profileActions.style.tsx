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
    paddingHorizontal: 8,
    marginTop: -48,
    marginBottom: 16,
    zIndex: 10,
    elevation: 10,
  },

  alertBanner: {
    marginHorizontal: 8,
    marginBottom: 16,
    zIndex: 20,
    elevation: 20,
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

  followInfo: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },

  followInfoText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
}));
