import { iconMapping } from "@/styles/icons";
import { Colors } from "@/styles/theme";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { useLoading } from "@/context/loadingContext";
import {
  iconButtonStyles,
  IconButtonType,
  iconColorByType,
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
  const isInactive = loading || disabled;
  const currentColor = isInactive ? Colors.disabled : iconColorByType[type];

  function renderIcon(): ReactNode {
    if (loading) {
      return <ActivityIndicator size="small" color={currentColor} />;
    }

    const Icon = iconMapping[icon];

    if (!Icon) return null;

    return (
      <Icon
        size={type === "overlay" ? size / 1.5 : size / 2}
        color={currentColor}
      />
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isInactive}
      style={[
        fullSize
          ? StyleSheet.absoluteFillObject
          : [
              { width: size, height: size },
              { borderRadius: circle ? size / 2 : 8 },
            ],

        iconButtonStyles.base,
        iconButtonStyles[type],

        type === "fill_image" && iconButtonStyles.overlay,

        isInactive && !fullSize && { opacity: 0.6 },
        style,
      ]}
      {...rest}
    >
      <View>{renderIcon()}</View>
    </TouchableOpacity>
  );
}
