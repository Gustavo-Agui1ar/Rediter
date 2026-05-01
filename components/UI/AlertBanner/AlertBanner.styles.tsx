import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const createAlertBannerStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },

  // ERROR
  errorContainer: {
    backgroundColor: colors.error + "1A",
    borderColor: colors.error + "4D",
  },
  errorText: {
    color: colors.error,
  },

  successContainer: {
    backgroundColor: colors.success + "1A",
    borderColor: colors.success + "4D",
  },
  successText: {
    color: colors.success,
  },

  infoContainer: {
    backgroundColor: colors.primary + "1A",
    borderColor: colors.primary + "4D",
  },
  infoText: {
    color: colors.primary,
  },

  warningContainer: {
    backgroundColor: colors.warning + "1A",
    borderColor: colors.warning + "4D",
  },
  warningText: {
    color: colors.warning,
  },
}));
