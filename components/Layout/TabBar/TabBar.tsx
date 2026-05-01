import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavItem } from "../NavBar/navbar";
import { useTabBarStyles } from "./TabBar.style";

interface TabBarProps<T> {
  items: NavItem<T>[];
  active: T;
  onChange: (id: T) => void;
}

const TabItem = memo(function TabItem<T>({
  item,
  isActive,
  onPress,
  styles,
}: {
  item: NavItem<T>;
  isActive: boolean;
  onPress: () => void;
  styles: ReturnType<typeof useTabBarStyles>;
}) {
  if (!item.label) return null;

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
});

export default function TabBar<T>({ items, active, onChange }: TabBarProps<T>) {
  const styles = useTabBarStyles();

  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const activeIndex = useMemo(() => {
    return items.findIndex((i) => i.id === active);
  }, [items, active]);

  useEffect(() => {
    if (tabWidth === 0 || items.length === 0 || activeIndex < 0) return;

    Animated.timing(translateX, {
      toValue: activeIndex * tabWidth,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, tabWidth, items.length]);

  function onLayout(e: LayoutChangeEvent) {
    const width = e.nativeEvent.layout.width;
    if (items.length > 0) {
      setTabWidth(width / items.length);
    }
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {items.map((item) => {
        const isActive = item.id === active;

        return (
          <TabItem
            key={String(item.id)}
            item={item}
            isActive={isActive}
            onPress={() => onChange(item.id)}
            styles={styles}
          />
        );
      })}

      {tabWidth > 0 && activeIndex >= 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth,
              opacity: tabWidth ? 1 : 0,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
}
