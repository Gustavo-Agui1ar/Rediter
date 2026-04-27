import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useFeedStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.background,
  },
  tabIndicator: {
    backgroundColor: colors.primary,
  },
  navBarContainer: {
    width: "100%",
    minHeight: 50,
  },
  tabContainer: {
    flex: 1,
    width: "100%",
  },

  tabItemContainer: {
    flex: 1,
    width: "100%",
    paddingTop: 16,
  },
}));
