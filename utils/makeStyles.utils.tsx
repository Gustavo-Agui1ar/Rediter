import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/styles/types/theme.types";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

type StyleGenerator<T> = (colors: ThemeColors) => T;

/**
 * Cria um hook de estilos que se adapta às mudanças de tema.
 * @template T O tipo de estilos a ser criado, geralmente definido como um objeto de estilos nomeados.
 * @param generator Uma função que recebe as cores do tema atual e retorna um objeto de estilos.
 * @return Um hook que pode ser usado dentro de componentes React para obter os estilos gerados dinamicamente com base no tema atual. O hook utiliza memoização para otimizar o desempenho, recalculando os estilos apenas quando as cores do tema mudam.
 */
export function makeStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(generator: StyleGenerator<T>) {
  return function useStyles() {
    const { colors } = useTheme();

    return useMemo(() => StyleSheet.create(generator(colors)), [colors]);
  };
}
