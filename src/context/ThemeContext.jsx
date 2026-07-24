import { createContext, useContext, useEffect, useState } from 'react';

/*
 * ThemeContext — replaces the dark/light toggle logic that lived in the
 * original AppComponent (app.component.ts toggleTheme()).
 * The original toggled a `dark-mode` class on <body>; we keep that exact
 * mechanism so theme.css works unchanged.
 */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((v) => !v);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
