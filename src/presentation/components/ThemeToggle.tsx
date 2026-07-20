import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      localStorage.getItem('theme') === 'dark';

    if (isDarkMode) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative flex items-center gap-2 px-3 py-1.5 h-9 rounded-xl border transition-all duration-300 bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-[#1C2B45] dark:hover:bg-[#253754] dark:text-amber-400 dark:border-[#2B3E60] shadow-sm cursor-pointer"
      title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400 animate-spin-once" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 hidden md:inline">Claro</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-slate-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 hidden md:inline">Oscuro</span>
        </>
      )}
      <span className="sr-only">Alternar Tema</span>
    </Button>
  );
}
