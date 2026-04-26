import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useDividerStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },

  text: {
    marginHorizontal: 10,
    color: colors.textMuted,
    fontSize: 14,
  },
}));
