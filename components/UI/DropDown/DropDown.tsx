import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    LayoutAnimation,
    Modal,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

import { ChevronDown } from "lucide-react-native";
import { useDropdownStyles } from "./DropDown.style";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DropdownProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

export function Dropdown({
  selectedValue,
  onValueChange,
  options,
  disabled = false,
}: DropdownProps) {
  const styles = useDropdownStyles();
  const [visible, setVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const selectedOption = useMemo(
    () => options.find((x) => x.value === selectedValue),
    [options, selectedValue],
  );

  const opacityAnim = useRef(new Animated.Value(0)).current;

  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: visible ? 1 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 12,
      }),

      Animated.timing(opacityAnim, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: visible ? 1 : 0.96,
        useNativeDriver: true,
        tension: 140,
        friction: 14,
      }),
    ]).start();
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[styles.trigger, disabled && styles.disabled]}
      >
        <Text style={styles.triggerText}>{selectedOption?.label}</Text>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown size={16} color={styles.triggerText.color} />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = item.value === selectedValue;

                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.option, selected && styles.selectedOption]}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      onValueChange(item.value);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selected && <View style={styles.dot} />}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
