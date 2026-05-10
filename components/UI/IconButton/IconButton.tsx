import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
// 1. Importamos o mapeamento estático e a tipagem diretamente
import { iconMapping, IconName } from "@/styles/icons";
import { ReactNode, useMemo } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import {
  IconButtonType,
  useIconButtonStyles,
  useIconColorsByType,
} from "./iconButton.style";

interface IconButtonProps extends TouchableOpacityProps {
  icon: IconName;
  size?: number;
  type?: IconButtonType;
  fullSize?: boolean;
  circle?: boolean;
  iconColor?: string; // 2. Adicionamos essa prop para forçar cores do tema quando necessário
}

export default function IconButton({
  icon,
  size = 44,
  type = "border",
  style,
  disabled,
  fullSize = false,
  circle = true,
  iconColor,
  ...rest
}: IconButtonProps) {
  const { loading } = useLoading();
  const { colors } = useTheme();

  const iconButtonStyles = useIconButtonStyles();
  const iconColors = useIconColorsByType();
  const isDisabled = disabled || loading;
  const color = isDisabled
    ? colors.disabled
    : iconColor || iconColors[type] || colors.textPrimary;

  const Icon = iconMapping[icon];

  const dynamicStyle = useMemo(() => {
    if (fullSize) return StyleSheet.absoluteFillObject;

    return {
      width: size,
      height: size,
      borderRadius: circle ? size / 2 : 12,
    };
  }, [fullSize, size, circle]);

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
        dynamicStyle,
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
