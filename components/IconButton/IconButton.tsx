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
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type IconName = "message" | "more" | "configuration" | "back-row" | "edit";

interface IconButtonProps extends TouchableOpacityProps {
  icon: IconName;
  size?: number;
  type?: "fill" | "border";
}

export default function IconButton({
  icon,
  size = 44,
  type = "border",
  style,
  ...rest
}: IconButtonProps) {
  function renderIcon(): ReactNode {
    switch (icon) {
      case "message":
        return <MessageCircle size={20} color={Colors.secondary} />;
      case "more":
        return <MoreHorizontal size={20} color={Colors.secondary} />;
      case "configuration":
        return <Settings size={20} color={Colors.secondary} />;
      case "back-row":
        return <ArrowLeft size={20} color={Colors.secondary} />;
      case "edit":
        return <EditIcon size={20} color={Colors.secondary} />;
      default:
        return null;
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        buttonStyles.base,
        buttonStyles[type],
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...rest}
    >
      <View>{renderIcon()}</View>
    </TouchableOpacity>
  );
}
