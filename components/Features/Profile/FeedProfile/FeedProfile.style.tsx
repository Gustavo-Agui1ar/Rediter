import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useFeedStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
    position: "relative",
  },

  headerAnimatedContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.background,
    width: "100%",
  },

  headerWrapper: {
    width: "100%",
    backgroundColor: colors.background,
  },

  customSpinner: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 99,
    padding: 8,
    borderRadius: 100,
    backgroundColor: colors.background,

    elevation: 6,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },

  tabBar: {
    backgroundColor: colors.background,
  },
  tabIndicator: {
    backgroundColor: colors.primary,
  },

  tabContainer: {
    flex: 1,
    width: "100%",
  },
  tabItemContainer: {
    flex: 1,
    width: "100%",
  },
}));
