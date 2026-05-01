import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const createHelperTextStyles = makeStyles((colors: ThemeColors) => ({
  text: {
    fontSize: 14,
    lineHeight: 20,
  },

  error: {
    color: colors.error,
  },

  success: {
    color: colors.success,
  },

  info: {
    color: colors.primary,
  },

  warning: {
    color: colors.warning,
  },
}));
