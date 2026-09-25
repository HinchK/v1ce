import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem("v1ce_theme").then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") setMode(stored);
    });
  }, []);

  const isDark = mode === "dark" || (mode === "system" && systemScheme === "dark");

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? "light" : "dark";
    setMode(next);
    void AsyncStorage.setItem("v1ce_theme", next);
  };

  const value = useMemo(() => ({ mode, isDark, toggleTheme }), [mode, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
