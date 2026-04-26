import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useLinkTextStyles = makeStyles((colors: ThemeColors) => ({
  link: {
    color: colors.link,
    fontSize: 14,
  },
}));
