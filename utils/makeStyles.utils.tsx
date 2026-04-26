import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/styles/types/theme.types";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

type StyleGenerator<T> = (colors: ThemeColors) => T;

export function makeStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(generator: StyleGenerator<T>) {
  return function useStyles() {
    const { colors } = useTheme();

    return useMemo(() => StyleSheet.create(generator(colors)), [colors]);
  };
}
