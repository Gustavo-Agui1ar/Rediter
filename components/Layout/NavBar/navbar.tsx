import { useTheme } from "@/context/ThemeContext";
import { iconMapping } from "@/styles/icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createdStylesNav } from "./navbar.style";

type IconName = keyof typeof iconMapping;

export interface NavItem<T = string> {
  id: T;
  label?: string;
  icon?: IconName;
}

interface NavBarProps<T> {
  items: NavItem<T>[];
  activeId: T;
  onPress: (id: T) => void;
}

export default function NavBar<T>({
  items,
  activeId,
  onPress,
}: NavBarProps<T>) {
  const { colors } = useTheme();
  const stylesNav = createdStylesNav(colors);

  return (
    <View style={stylesNav.container}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon ? iconMapping[item.icon] : null;

        return (
          <TouchableOpacity
            key={String(item.id)}
            style={stylesNav.navItem}
            onPress={() => onPress(item.id)}
            activeOpacity={0.8}
          >
            {Icon && (
              <View
                style={[
                  stylesNav.iconContainer,
                  isActive && stylesNav.activeIcon,
                ]}
              >
                <Icon
                  size={22}
                  color={isActive ? colors.primary : colors.textMuted}
                />
              </View>
            )}

            {!!item.label && (
              <Text
                style={[stylesNav.label, isActive && stylesNav.activeLabel]}
              >
                {item.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
