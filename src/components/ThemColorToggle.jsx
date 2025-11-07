"use client";
import * as React from "react";
import { useThemeContext } from "@/context/ThemeDataProvider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const availableThemeColors = [
  { name: "Default", light: "bg-zinc-900", dark: "bg-zinc-700" },
  { name: "Blue", light: "bg-blue-600", dark: "bg-blue-700" },
  { name: "Green", light: "bg-green-600", dark: "bg-green-500" },
  { name: "Orange", light: "bg-orange-500", dark: "bg-orange-700" },
  { name: "Red", light: "bg-red-600", dark: "bg-red-700" },
  { name: "Rose", light: "bg-rose-600", dark: "bg-rose-700" },
  { name: "Violet", light: "bg-violet-600", dark: "bg-violet-700" },
  { name: "Yellow", light: "bg-yellow-500", dark: "bg-yellow-600" },
];

const ThemeColorToggle = () => {
  const { themeColor, setThemeColor } = useThemeContext();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {availableThemeColors.map(({ name, light, dark }) => (
        <button
          key={name}
          onClick={() => setThemeColor(name)}
          className={cn(
            "relative rounded-full w-4 h-4 transition-all hover:scale-110",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            resolvedTheme === "light" ? light : dark,
            themeColor === name && "ring-2 ring-offset-2 ring-primary"
          )}
          title={name}
          aria-label={`Select ${name} theme`}
        >
          {themeColor === name && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-3 h-3 text-white drop-shadow-lg" strokeWidth={3} />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeColorToggle;