import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Button } from '@/presentation/components/ui/button';
import { ThemeToggle } from '@/presentation/components/ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet';
import { cn } from '@/presentation/utils/cn';
import { Trophy, Users, UserSquare2, Shield, CalendarDays, LayoutDashboard, CreditCard, ChevronRight, LogOut } from 'lucide-react';

const RED = '#E31C3D';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Torneos', href: '/admin/torneos', icon: Trophy },
  { label: 'Equipos', href: '/admin/equipos', icon: Shield },
  { label: 'Jugadores', href: '/admin/jugadores', icon: UserSquare2 },
  { label: 'Partidos', href: '/admin/partidos', icon: CalendarDays },
  { label: 'Suscripciones', href: '/admin/suscripciones', icon: CreditCard },
  { label: 'Usuarios', href: '/admin/usuarios', icon: Users },
];

interface SideNavLinkProps {
  item: NavItem;
  currentPath: string;
  onClick?: () => void;
}

function SideNavLink({ item, currentPath, onClick }: SideNavLinkProps) {
  const isActive = item.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg',
        isActive
          ? 'bg-red-50 text-[#E31C3D]'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80',
      )}
    >
      <Icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-[#E31C3D]" : "text-slate-400 group-hover:text-slate-950")} />
      <span style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
    </Link>
  );
}

interface SidebarContentProps {
  currentPath: string;
  onLinkClick?: () => void;
}

function SidebarContent({ currentPath, onLinkClick }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col relative overflow-hidden border-r border-slate-200 bg-white">
      <div className="px-6 py-8 relative z-10 flex items-center justify-center border-b border-slate-200 mb-6">
        <Link to="/" className="flex items-center gap-0">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '24px', color: RED, letterSpacing: '-0.01em' }}>FÚTBOL</span>
          <span className="text-slate-900 ml-1" style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '24px', letterSpacing: '-0.01em' }}>PULSE</span>
          <span className="ml-1.5 w-1.5 h-1.5 rounded-full" style={{ background: RED }} />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 relative z-10 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>

      <div className="p-4 mt-auto relative z-10 border-t border-slate-200">
        <Link
          to="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-550 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-lg w-full"
        >
          <LogOut className="h-4.5 w-4.5 text-slate-450 group-hover:text-slate-900 transition-colors" />
          <span style={{ fontFamily: "'Inter', sans-serif" }}>Portal Público</span>
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
    <div className="flex h-screen w-screen overflow-hidden text-slate-800 transition-colors bg-slate-50">
      <aside className="hidden w-[260px] shrink-0 md:flex flex-col z-20 transition-colors bg-white h-full">
        <SidebarContent currentPath={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        <header className="flex h-20 items-center justify-between gap-4 border-b border-slate-200 px-8 transition-colors bg-white shrink-0">
          <div className="flex items-center md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú" className="hover:bg-slate-50 text-slate-700 rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] border-r border-slate-200 bg-white p-0 text-slate-900">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menú Administrativo</SheetTitle>
                </SheetHeader>
                <SidebarContent currentPath={pathname} onLinkClick={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="ml-3 text-sm font-black text-slate-900 tracking-wider uppercase" style={{ fontFamily: FONT_DISPLAY }}>Fútbol Pulse</span>
          </div>

          <div className="hidden md:flex flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1.5 border border-slate-200/60 rounded-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Panel de Administración
            </div>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 bg-emerald-50/80 text-emerald-700 border border-emerald-200 rounded-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Temporada Activa
            </div>

            <ThemeToggle />

            {user && (
              <Link to="perfil" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                {user.foto_perfil ? (
                  <img src={user.foto_perfil} alt="Perfil" className="h-9 w-9 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
                    {(user.nombre_completo || user.username || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 transition-colors bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
