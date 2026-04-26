import { DarkColors, LightColors } from "@/styles/Colors";
import { getColorTheme, saveColorTheme } from "@/utils/storage.utils";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeType = "dark" | "light";

interface ThemeContextProps {
  theme: ThemeType;
  colors: typeof DarkColors | typeof LightColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps>({} as any);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("dark");

  useEffect(() => {
    async function loadTheme() {
      const stored = await getColorTheme();
      setThemeState(stored);
    }
    loadTheme();
  }, []);

  async function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    await saveColorTheme(newTheme === "dark");
  }

  async function setTheme(newTheme: ThemeType) {
    setThemeState(newTheme);
    await saveColorTheme(newTheme === "dark");
  }

  const colors = theme === "dark" ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
