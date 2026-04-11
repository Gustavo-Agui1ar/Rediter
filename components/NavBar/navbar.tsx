import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { stylesNav } from "./navbar.style";

export interface NavItem<T = string> {
  id: T;
  label: string;
  icon: React.ReactNode;
}

interface NavBarProps<T> {
  items: NavItem<T>[];
  activeId: T;
  onPress: (id: T) => void;
}

export function NavBar<T>({ items, activeId, onPress }: NavBarProps<T>) {
  return (
    <View style={stylesNav.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={String(item.id)}
          style={stylesNav.navItem}
          onPress={() => onPress(item.id)}
        >
          {item.icon ? (
            <View
              style={[
                stylesNav.iconContainer,
                activeId === item.id && stylesNav.activeIcon,
              ]}
            >
              {item.icon}
            </View>
          ) : null}

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
}
