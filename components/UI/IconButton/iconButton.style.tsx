import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export type IconButtonType = "border" | "fill" | "none" | "overlay";

export const useIconColorsByType = () => {
  const { colors } = useTheme();

  return {
    border: colors.primary,
    fill: colors.white,
    none: colors.textPrimary,
    overlay: colors.white,
  };
};

export const useIconButtonStyles = makeStyles((colors: ThemeColors) => ({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    borderWidth: 2.5,
    borderColor: colors.border_button,
  },
  fill: {
    backgroundColor: colors.fill_button,
  },
  none: {
    backgroundColor: "transparent",
  },
  overlay: {
    backgroundColor: colors.overlay,
  },
  disabled: {
    opacity: 0.5,
  },
}));
