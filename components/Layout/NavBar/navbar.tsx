import { useTheme } from "@/context/ThemeContext";
import { iconMapping } from "@/styles/icons";
import React, { memo, useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { useNavStyles } from "./navbar.style";

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

interface AnimatedItemProps<T> {
  item: NavItem<T>;
  isActive: boolean;
  onPress: (id: T) => void;
  colors: ThemeColors;
  stylesNav: any;
}

const AnimatedItemComponent = <T,>({
  item,
  isActive,
  onPress,
  colors,
  stylesNav,
}: AnimatedItemProps<T>) => {
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isActive, anim]);

  const Icon = item.icon ? iconMapping[item.icon] : null;

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 0],
  });

  const iconColor = isActive ? colors.primaryLight : colors.textMuted;
  const textColor = isActive ? colors.primary : colors.textMuted;

  return (
    <TouchableOpacity
      style={stylesNav.navItem}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      {Icon && (
        <Animated.View
          style={[stylesNav.iconContainer, { transform: [{ scale }] }]}
        >
          <Icon size={22} color={iconColor} />
        </Animated.View>
      )}

      {!!item.label && (
        <Animated.Text
          style={[
            stylesNav.label,
            {
              opacity: anim,
              color: textColor,
              transform: [{ translateY }],
            },
          ]}
        >
          {item.label}
        </Animated.Text>
      )}
    </TouchableOpacity>
  );
};

const AnimatedItem = memo(
  AnimatedItemComponent,
) as typeof AnimatedItemComponent;

export default function NavBar<T>({
  items,
  activeId,
  onPress,
}: NavBarProps<T>) {
  const { colors } = useTheme();
  const stylesNav = useNavStyles();

  return (
    <View style={stylesNav.container}>
      {items.map((item) => (
        <AnimatedItem
          key={String(item.id)}
          item={item}
          isActive={activeId === item.id}
          onPress={onPress}
          colors={colors}
          stylesNav={stylesNav}
        />
      ))}
    </View>
  );
}
