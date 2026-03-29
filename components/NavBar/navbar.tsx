import { styles } from "@/styles/theme";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { stylesNav } from "./navbar.style";

// types/navigation.ts
export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
}

interface NavBarProps {
  items: NavItem[];
  activeId: string;
}

export const NavBar = ({ items, activeId }: NavBarProps) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={stylesNav.navItem}
          onPress={() => router.push(item.route as any)}
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
