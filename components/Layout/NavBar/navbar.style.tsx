import { TextSize } from "@/styles/global.styles";
import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useNavStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    minWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  navItem: {
    width: 72,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
  },
  iconContainer: {
    padding: 6,
    borderRadius: 12,
  },
  activeIcon: {
    borderRadius: 8,
    backgroundColor: colors.primaryDark,
  },
  label: {
    fontSize: TextSize.xs,
    textAlign: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: colors.error || "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.background,
    zIndex: 10,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
}));
