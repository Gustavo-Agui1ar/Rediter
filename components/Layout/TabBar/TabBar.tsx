import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavItem } from "../NavBar/navbar";
import { createdTabBarStyles } from "./TabBar.style";

interface TabBarProps<T> {
  items: NavItem<T>[];
  active: T;
  onChange: (id: T) => void;
}

export default function TabBar<T>({ items, active, onChange }: TabBarProps<T>) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const { colors } = useTheme();
  const tabBarStyles = createdTabBarStyles(colors);

  const activeIndex = items.findIndex((i) => i.id === active);

  useEffect(() => {
    if (tabWidth === 0) return;

    Animated.timing(translateX, {
      toValue: activeIndex * tabWidth,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, tabWidth]);

  function onLayout(e: LayoutChangeEvent) {
    const width = e.nativeEvent.layout.width;
    setTabWidth(width / items.length);
  }

  return (
    <View style={tabBarStyles.container} onLayout={onLayout}>
      {items.map((item) => {
        if (!item.label) return null;

        const isActive = item.id === active;

        return (
          <TouchableOpacity
            key={String(item.id)}
            style={tabBarStyles.tab}
            onPress={() => onChange(item.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[tabBarStyles.label, isActive && tabBarStyles.activeLabel]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {tabWidth > 0 && (
        <Animated.View
          style={[
            tabBarStyles.indicator,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
}
