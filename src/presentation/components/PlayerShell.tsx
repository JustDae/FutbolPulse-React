import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

import { Button } from '@/presentation/components/ui/button';
import { ThemeToggle } from '@/presentation/components/ThemeToggle';
import { LogOut, Menu, Activity, Calendar, MessageSquare, Zap } from 'lucide-react';

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
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Rendimiento', href: '/jugador', icon: Activity },
  { label: 'Partidos', href: '/jugador/partidos', icon: Calendar },
  { label: 'Feedback', href: '/jugador/feedback', icon: MessageSquare },
];

interface SideNavLinkProps {
  item: NavItem;
  currentPath: string;
  onClick?: () => void;
}

function SideNavLink({ item, currentPath, onClick }: SideNavLinkProps) {
  const isActive =
    item.href === '/jugador' ? currentPath === '/jugador' : currentPath.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 relative',
        isActive
          ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(204,255,0,0.3)] translate-x-1'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
      )}
    >
      <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
      <span className="tracking-wide">{item.label}</span>
      {isActive && (
        <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
      )}
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
    <div className="flex h-full flex-col glass-card relative overflow-hidden border-r-0 rounded-r-3xl my-4 ml-4">
      <div className="px-8 py-10 relative z-10 flex flex-col border-b border-border/50 mb-6">
        <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-foreground">FÚTBOL<span className="text-primary">PULSE</span></span>
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70 mt-3 neon-text-glow">Portal Pro</p>
      </div>
      <nav className="flex-1 space-y-2 px-4 relative z-10 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>
      <div className="p-4 mt-auto relative z-10">
        <div className="rounded-2xl bg-black/40 border border-white/5 p-5 mb-4 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase tracking-widest">Próximo Partido</p>
          <p className="text-sm font-black text-foreground">vs. Atlético Central</p>
          <p className="text-xs text-primary mt-1.5 font-semibold flex items-center gap-1.5">
             <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
             Sáb, 18:30 • Local
          </p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-4 rounded-xl px-4 py-4 text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full h-auto group"
          onClick={() => {
            logout();
            onLinkClick?.();
          }}
        >
          <LogOut className="h-5 w-5 transition-colors group-hover:text-destructive" />
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
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors selection:bg-primary selection:text-primary-foreground">
      {}
      <aside className="hidden w-[280px] shrink-0 md:flex flex-col z-20 h-full">
        <SidebarContent currentPath={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        {}
        <header className="flex h-24 items-center justify-between gap-4 glass mx-6 mt-4 rounded-2xl px-8 transition-colors shrink-0">
          <div className="flex items-center md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú" className="hover:bg-white/10 text-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r border-border/50 bg-background/95 backdrop-blur-xl p-0 text-foreground">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menú Jugador</SheetTitle>
                </SheetHeader>
                <SidebarContent currentPath={pathname} onLinkClick={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="ml-4 text-lg font-black tracking-wide uppercase text-foreground">
              Fútbol<span className="text-primary">Pulse</span>
            </span>
          </div>

          <div className="hidden md:flex flex-1">
             <div className="text-sm font-bold text-muted-foreground bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-inner">
               Dashboard General
             </div>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 neon-glow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              En Línea
            </div>

            <ThemeToggle />

            {user && (
              <Link to="perfil" className="flex items-center gap-4 hover:opacity-80 transition-opacity p-1.5 pr-4 rounded-full bg-white/5 border border-white/10">
                <div className="relative h-10 w-10">
                  {user.foto_perfil ? (
                    <img src={user.foto_perfil} alt="Perfil" className="h-full w-full rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-background" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-black shadow-sm ring-2 ring-primary/50">
                      {(user.nombre_completo || user.username || 'J').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-black leading-none">{user.nombre_completo || user.username}</p>
                  <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1">Jugador Pro</p>
                </div>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
