import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesTyping = makeStyles((colors: ThemeColors) => ({
  typingIndicatorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  typingText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 15,
    paddingTop: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
}));
