import { buttonStyles } from "@/components/Button/button.style";
import { Colors } from "@/styles/theme";
import {
  ArrowLeft,
  EditIcon,
  MessageCircle,
  MoreHorizontal,
  Settings,
} from "lucide-react-native";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type IconName = "message" | "more" | "configuration" | "back-row" | "edit";

interface IconButtonProps extends TouchableOpacityProps {
  icon: IconName;
  size?: number;
  type?: "fill" | "border" | "none";
  fullSize?: boolean;
  loading?: boolean;
}

export default function IconButton({
  icon,
  size = 44,
  type = "border",
  style,
  disabled,
  fullSize = false,
  loading,
  ...rest
}: IconButtonProps) {
  const isInactive = loading || disabled;
  const currentColor =
    type === "none" || fullSize
      ? Colors.perimary
      : isInactive
        ? Colors.disabled
        : Colors.secondary;

  function renderIcon(): ReactNode {
    if (loading) return <ActivityIndicator size="small" color={currentColor} />;

    const props = { size: fullSize ? 28 : size / 2, color: currentColor };
    switch (icon) {
      case "message":
        return <MessageCircle {...props} />;
      case "more":
        return <MoreHorizontal {...props} />;
      case "configuration":
        return <Settings {...props} />;
      case "back-row":
        return <ArrowLeft {...props} />;
      case "edit":
        return <EditIcon {...props} />;
      default:
        return null;
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isInactive}
      style={[
        fullSize
          ? StyleSheet.absoluteFillObject
          : { width: size, height: size, borderRadius: size / 2 },
        buttonStyles.base,
        type !== "none" && buttonStyles[type],
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: type === "none" ? "rgba(0,0,0,0.4)" : undefined,
        },
        isInactive && !fullSize && { opacity: 0.6 },
        style,
      ]}
      {...rest}
    >
      <View>{renderIcon()}</View>
    </TouchableOpacity>
  );
}
