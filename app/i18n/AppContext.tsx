"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Translations } from "./translations";

type Lang = "fr" | "en";
type Theme = "dark" | "light";

interface AppContextType {
  lang: Lang;
  theme: Theme;
  toggleLang: () => void;
  toggleTheme: () => void;
  t: Translations;
}

const AppContext = createContext<AppContextType>({
  lang: "fr", theme: "dark",
  toggleLang: () => {}, toggleTheme: () => {},
  t: translations.fr,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedLang = (localStorage.getItem("lang") as Lang) || "fr";
    const savedTheme = (localStorage.getItem("theme") as Theme) || "dark";
    setLang(savedLang);
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleLang = () => {
    const next = lang === "fr" ? "en" : "fr";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <AppContext.Provider value={{ lang, theme, toggleLang, toggleTheme, t: translations[lang] }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
