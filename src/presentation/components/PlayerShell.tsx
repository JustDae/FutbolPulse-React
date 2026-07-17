import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

import { Button } from '@/presentation/components/ui/button';
import { ThemeToggle } from '@/presentation/components/ThemeToggle';
import { LogOut, ChevronRight, Menu } from 'lucide-react';
import { Separator } from '@/presentation/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet';
import { cn } from '@/presentation/utils/cn';
import { useAuthStore } from '../store/auth.store';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Mi Rendimiento', href: '/jugador' },
  { label: 'Mis Partidos', href: '/jugador/partidos' },
  { label: 'Feedback', href: '/jugador/feedback' },
];

interface SideNavLinkProps {
  item: NavItem;
  currentPath: string;
  onClick?: () => void;
}

function SideNavLink({ item, currentPath, onClick }: SideNavLinkProps) {
  const isActive =
    item.href === '/jugador' ? currentPath === '/jugador' : currentPath.startsWith(item.href);

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
        isActive
          ? 'bg-[#f94116] text-white shadow-md'
          : 'text-gray-600 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white',
      )}
    >
      <span className="tracking-wide">{item.label}</span>
    </Link>
  );
}

interface SidebarContentProps {
  currentPath: string;
  onLinkClick?: () => void;
}

function SidebarContent({ currentPath, onLinkClick }: SidebarContentProps) {
  const { logout } = useAuthStore();
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#101010] relative overflow-hidden border-r border-gray-200 dark:border-[#1a1a1c]">
      <div className="px-6 py-8 relative z-10 flex flex-col items-center justify-center border-b border-gray-200 dark:border-[#1a1a1c] mb-6">
        <h2 className="text-[22px] font-black tracking-tighter uppercase italic flex items-center gap-1.5">
          <span className="text-[#f94116]">FÚTBOL</span>
          <span className="text-gray-900 dark:text-white">PULSE</span>
        </h2>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-[#888888] mt-2">Portal del Jugador</p>
      </div>
      <nav className="flex-1 space-y-1.5 px-4 relative z-10 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>
      <div className="p-4 mt-auto relative z-10">
        <div className="rounded-2xl bg-gray-50 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 p-5 mb-4 shadow-sm relative overflow-hidden">
          <p className="text-[10px] text-gray-500 dark:text-[#888888] font-bold mb-1 uppercase tracking-widest">Próximo Partido</p>
          <p className="text-sm font-black text-gray-900 dark:text-white">vs. Atlético Central</p>
          <p className="text-xs text-[#f94116] mt-1 font-semibold">Sáb, 18:30 • Local</p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-all w-full h-auto"
          onClick={() => {
            logout();
            onLinkClick?.();
          }}
        >
          <LogOut className="h-5 w-5 text-gray-500 dark:text-zinc-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          <span className="tracking-wide">Cerrar sesión</span>
        </Button>
      </div>
    </div>
  );
}

export function PlayerShell() {
  const { pathname } = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#101010] text-gray-900 dark:text-zinc-50 transition-colors">
      {/* Sidebar Desktop */}
      <aside className="hidden w-[260px] shrink-0 bg-white dark:bg-[#101010] md:flex flex-col z-20 transition-colors">
        <SidebarContent currentPath={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 bg-white dark:bg-[#101010] border-b border-gray-200 dark:border-[#1a1a1c] px-8 transition-colors">
          <div className="flex items-center md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú" className="hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] border-r border-gray-200 dark:border-[#1a1a1c] bg-white dark:bg-[#101010] p-0 text-gray-900 dark:text-white">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menú Jugador</SheetTitle>
                </SheetHeader>
                <SidebarContent currentPath={pathname} onLinkClick={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="ml-3 text-sm font-black text-gray-900 dark:text-white tracking-wide uppercase">Fútbol Pulse</span>
          </div>

          <div className="hidden md:flex flex-1">
             <div className="text-sm font-medium text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-[#1a1a1c] px-4 py-2 rounded-full border border-gray-200 dark:border-white/5 shadow-sm">
               Visión General
             </div>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-gray-100 dark:bg-[#1a1a1c] text-gray-800 dark:text-white border border-gray-200 dark:border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              En Línea
            </div>
            
            <ThemeToggle />
            
            {user && (
              <Link to="perfil" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-none">{user.nombre_completo || user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Jugador Pro</p>
                </div>
                <div className="relative h-10 w-10">
                  {user.foto_perfil ? (
                    <img src={user.foto_perfil} alt="Perfil" className="h-full w-full rounded-full object-cover border border-gray-200 dark:border-[#1a1a1c]" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#f94116] text-sm font-bold text-white shadow-sm">
                      {(user.nombre_completo || user.username || 'J').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
