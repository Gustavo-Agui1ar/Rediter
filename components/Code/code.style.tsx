import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useCodeStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 4,
    textAlign: "center",
    color: colors.textPrimary,
    borderColor: colors.primary,
    fontSize: 24,
  },
}));
