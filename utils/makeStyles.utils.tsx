import { useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

type StyleGenerator<T> = (colors: any) => T;

export function makeStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(generator: StyleGenerator<T>) {
  return function useStyles() {
    const { colors } = useTheme();

    return useMemo(() => StyleSheet.create(generator(colors)), [colors]);
  };
}
