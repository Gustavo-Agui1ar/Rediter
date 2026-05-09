import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useSendEmailStyle = makeStyles((colors: ThemeColors) => ({
  content_card: {
    width: "100%",
    height: "100%",
    maxWidth: 420,
    alignSelf: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: 28,
  },

  instructionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },

  fieldContainer: {
    width: "100%",
    gap: 4,
  },

  helperText: {
    paddingLeft: 4,
  },
}));
