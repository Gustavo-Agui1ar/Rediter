// FeedProfile.style.ts
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
    paddingBottom: 24,
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
}));
