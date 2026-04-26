import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesProfileCover = makeStyles((colors: ThemeColors) => ({
  container: {
    width: "100%",
    aspectRatio: 2,
    backgroundColor: colors.textMuted,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
}));
