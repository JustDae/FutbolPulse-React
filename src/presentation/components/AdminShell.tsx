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
import { useAuthStore } from '@/presentation/store/auth.store';

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
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
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
    <div className="flex h-full flex-col gap-2">
      <div className="px-4 py-6">
        <div className="mb-1 flex items-center gap-2 text-lg font-bold text-sidebar-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/10">
            <Trophy className="h-5 w-5" />
          </div>
          Fútbol Pulse
        </div>
        <p className="pl-11 text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">Panel deportivo</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>
      <div className="px-3 pb-4">
        <Separator className="mb-4 bg-sidebar-border" />
        <Link
          to="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <SidebarContent currentPath={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card/60 px-4 backdrop-blur-md md:px-6 shadow-sm">
          <div className="flex items-center md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú" className="hover:bg-primary/10 hover:text-primary transition-colors">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navegación de administración</SheetTitle>
                </SheetHeader>
                <SidebarContent currentPath={pathname} onLinkClick={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="ml-3 text-sm font-bold text-foreground tracking-wide uppercase">Panel Deportivo</span>
          </div>

          <div className="hidden md:flex flex-1">
             <div className="text-sm font-medium text-muted-foreground">
               Administración
             </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Temporada Activa
            </div>
            
            {user && (
              <Link to="perfil" className="flex items-center gap-3 border-l pl-4 hover:opacity-80 transition-opacity">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-none">{user.nombre_completo || user.username}</p>
                  <p className="text-xs text-muted-foreground mt-1">Administrador</p>
                </div>
                {user.foto_perfil ? (
                  <img src={user.foto_perfil} alt="Perfil" className="h-9 w-9 rounded-full object-cover border border-primary/20 shadow-sm" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
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
