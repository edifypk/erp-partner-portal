"use client";
import setGlobalColorTheme from "@/lib/theme-colors";
import { useTheme } from "next-themes";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext({});

export default function ThemeDataProvider({
  children,
}) {
  const getSavedThemeColor = () => {
    try {
      return localStorage.getItem("themeColor") || "Default";
    } catch (error) {
      return "Default";
    }
  };

  const [themeColor, setThemeColor] = useState(getSavedThemeColor());
  const [isMounted, setIsMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
    
    // Use resolvedTheme instead of theme to handle "system" preference
    // resolvedTheme will be either "light" or "dark" based on system preference
    const actualTheme = resolvedTheme || theme;
    
    if (actualTheme && actualTheme !== "system") {
      setGlobalColorTheme(actualTheme, themeColor);
    }

    if (!isMounted) {
      setIsMounted(true);
    }
  }, [themeColor, theme, resolvedTheme, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}