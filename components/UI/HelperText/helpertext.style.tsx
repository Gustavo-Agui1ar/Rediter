import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const createHelperTextStyles = makeStyles((colors: ThemeColors) => ({
  text: {
    color: colors.error,
    fontSize: 12,
    paddingLeft: 10,
  },
}));
