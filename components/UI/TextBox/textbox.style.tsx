import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useTextboxStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  focused: {
    borderColor: colors.primary,
  },

  base: {
    width: "100%",
    color: colors.textPrimary,
    textAlignVertical: "center",
    fontSize: 16,
    lineHeight: 28,
    padding: 0,
  },

  inputWrapper: {
    justifyContent: "center",
  },

  icon: {
    position: "absolute",
    right: 4,
    padding: 6,
  },
}));
