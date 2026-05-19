import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Check local storage or system preference on initial load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 shadow-sm border border-transparent dark:border-slate-600"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <>
          <span className="text-lg">☀️</span>
          <span className="text-sm font-medium">Light Mode</span>
        </>
      ) : (
        <>
          <span className="text-lg">🌙</span>
          <span className="text-sm font-medium">Dark Mode</span>
        </>
      )}
    </button>
  );
}