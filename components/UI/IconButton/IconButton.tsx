import { iconMapping } from "@/styles/icons";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import {
  createIconButtonStyles,
  getIconColorByType,
  IconButtonType,
} from "./iconButton.style";

type IconName = keyof typeof iconMapping;

interface IconButtonProps extends TouchableOpacityProps {
  icon: IconName;
  size?: number;
  type?: IconButtonType;
  fullSize?: boolean;
  circle?: boolean;
}

export default function IconButton({
  icon,
  size = 44,
  type = "border",
  style,
  disabled,
  fullSize = false,
  circle = true,
  ...rest
}: IconButtonProps) {
  const { loading } = useLoading();
  const { colors } = useTheme();

  const isDisabled = disabled || loading;
  const color = isDisabled
    ? colors.disabled
    : getIconColorByType(colors)[type] || colors.textPrimary;

  const Icon = iconMapping[icon];
  const iconButtonStyles = createIconButtonStyles(colors);

  function renderContent(): ReactNode {
    if (loading) {
      return <ActivityIndicator size="small" color={color} />;
    }

    if (!Icon) return null;

    return <Icon size={size * 0.5} color={color} />;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        fullSize
          ? StyleSheet.absoluteFillObject
          : {
              width: size,
              height: size,
              borderRadius: circle ? size / 2 : 12,
            },

        iconButtonStyles.base,
        iconButtonStyles[type],

        type === "overlay" && iconButtonStyles.overlay,

        isDisabled && !fullSize && iconButtonStyles.disabled,
        style,
      ]}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
