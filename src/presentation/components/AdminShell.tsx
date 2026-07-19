import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  Users, 
  CalendarDays, 
  Trophy, 
  Menu, 
  ArrowLeft,
  UserRound,
  CircleDot,
} from 'lucide-react';

import { Button } from '@/presentation/components/ui/button';
import { Separator } from '@/presentation/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet';
import { cn } from '@/presentation/utils/cn';
import { useAuthStore } from '@/presentation/store/auth.store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Torneos', href: '/admin/torneos', icon: Trophy },
  { label: 'Equipos', href: '/admin/equipos', icon: Shield },
  { label: 'Jugadores', href: '/admin/jugadores', icon: Users },
  { label: 'Partidos', href: '/admin/partidos', icon: CalendarDays },
  { label: 'Suscripciones', href: '/admin/suscripciones', icon: CircleDot },
  { label: 'Usuarios', href: '/admin/usuarios', icon: UserRound },
];

interface SideNavLinkProps {
  item: NavItem;
  currentPath: string;
  onClick?: () => void;
}

function SideNavLink({ item, currentPath, onClick }: SideNavLinkProps) {
  const isActive =
    item.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-4 active:scale-[0.98]',
        isActive
          ? 'bg-zinc-900/80 text-red-500 border-l-red-600 shadow-inner'
          : 'border-l-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100',
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-red-500" : "text-zinc-400")} />
      {item.label}
    </Link>
  );
}

interface SidebarContentProps {
  currentPath: string;
  onLinkClick?: () => void;
}

function SidebarContent({ currentPath, onLinkClick }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-2 bg-zinc-950 text-white">
      <div className="px-4 py-6">
        <div className="mb-1 flex items-center gap-2 text-lg font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/25">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1 tracking-tight">
            <span className="text-red-500 font-extrabold">FÚTBOL</span>
            <span className="text-white font-bold">PULSE</span>
            <span className="text-red-500 font-black">•</span>
          </div>
        </div>
        <p className="pl-11 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Panel administrativo</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>
      <div className="px-3 pb-4">
        <Separator className="mb-4 bg-zinc-800" />
        <Link
          to="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Volver al portal público
        </Link>
      </div>
    </div>
  );
}

export function AdminShell() {
  const { pathname } = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 md:flex">
        <SidebarContent currentPath={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-background/85 px-4 backdrop-blur-md md:px-6 shadow-sm">
          <div className="flex items-center md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú" className="hover:bg-red-500/10 hover:text-red-500 transition-colors">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-zinc-800 bg-zinc-950 p-0 text-white">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navegación de administración</SheetTitle>
                </SheetHeader>
                <SidebarContent currentPath={pathname} onLinkClick={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="ml-3 text-xs font-extrabold text-foreground tracking-widest uppercase">
              <span className="text-red-600">Fútbol</span> Pulse
            </span>
          </div>

          <div className="hidden md:flex flex-1">
             <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
               Administración
             </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Temporada Activa
            </div>
            
            {user && (
              <Link to="perfil" className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-4 hover:opacity-85 transition-opacity">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-bold leading-none text-foreground">{user.nombre_completo || user.username}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Administrador</p>
                </div>
                {user.foto_perfil ? (
                  <img src={user.foto_perfil} alt="Perfil" className="h-9 w-9 rounded-full object-cover border border-red-500/25 shadow-sm" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 font-bold shadow-sm text-sm">
                    {(user.nombre_completo || user.username || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

