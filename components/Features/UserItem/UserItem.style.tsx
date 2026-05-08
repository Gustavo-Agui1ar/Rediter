import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesUserItem = makeStyles((colors: ThemeColors) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 16,
    flexShrink: 1,
  },
  buttonContainer: {
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
}));
