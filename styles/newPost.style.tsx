import { makeStyles } from "@/utils/makeStyles.utils";
import { ThemeColors } from "./types/theme.types";

export const useNewPostStyles = makeStyles((colors: ThemeColors) => ({
  contentWrapper: {
    justifyContent: "flex-start",
    paddingTop: 16,
    width: "95%",
  },
  actionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "bold",
  },
  iconBar: {
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  emojiContainer: {
    height: 320,
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
}));
