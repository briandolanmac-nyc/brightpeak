"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeButtons = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  const themes = [
    { id: "light", label: "Light", icon: "☀️" },
    { id: "dark", label: "Dark", icon: "🌙" },
    { id: "solar-green", label: "Solar Panel Green", icon: "🌿" },
    { id: "sky", label: "Sky Blue", icon: "🌤️" },
    { id: "june-bud", label: "June Bud", icon: "🌼" },
    { id: "sunburst", label: "Sunburst Red", icon: "🔥" },
    { id: "solar", label: "Solar Flare Gold", icon: "🌞" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-selector">
        <button className="theme-selector-btn" disabled>
          🎨 Theme
        </button>
      </div>
    );
  }

  const effectiveTheme = theme || resolvedTheme || "light";

  return (
    <div className="theme-selector">
      {themes.map((themeOption) => (
        <button
          key={themeOption.id}
          onClick={() => setTheme(themeOption.id)}
          className={`theme-option ${effectiveTheme === themeOption.id ? "active" : ""}`}
          title={themeOption.label}
          aria-label={`Switch to ${themeOption.label} theme`}
        >
          {themeOption.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeButtons;
export { ThemeButtons };
