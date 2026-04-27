import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesHeader = makeStyles((colors: ThemeColors) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    height: 72,
    backgroundColor: colors.background,
    gap: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
}));
