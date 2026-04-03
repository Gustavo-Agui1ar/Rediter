import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { stylesNav } from "./navbar.style";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavBarProps {
  items: NavItem[];
  activeId: string;
  onPress: (id: string) => void;
}

export const NavBar = ({ items, activeId, onPress }: NavBarProps) => {
  return (
    <View style={stylesNav.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={stylesNav.navItem}
          onPress={() => onPress(item.id)}
        >
          <View
            style={[
              stylesNav.iconContainer,
              activeId === item.id && stylesNav.activeIcon,
            ]}
          >
            {item.icon}
          </View>
          <Text
            style={[
              stylesNav.label,
              activeId === item.id && stylesNav.activeLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
