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
        'group relative flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-xl',
        isActive
          ? 'bg-[#E31C3D] text-white shadow-lg shadow-[#E31C3D]/25'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-[#1C2B45]/50',
      )}
    >
      <Icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-800 dark:text-white/40 dark:group-hover:text-white")} />
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
    <div className="flex h-full flex-col relative overflow-hidden border-r border-slate-200 bg-white dark:border-[#1C2B45] dark:bg-[#0B1220] text-slate-800 dark:text-white">
      <div className="px-6 py-6 relative z-10 flex flex-col items-start border-b border-slate-200 dark:border-[#1C2B45] mb-6">
        <Link to="/" className="flex items-center gap-1">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '26px', color: RED, letterSpacing: '-0.01em' }}>FÚTBOL</span>
          <span className="text-slate-900 dark:text-white ml-1" style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '26px', letterSpacing: '-0.01em' }}>PULSE</span>
          <span className="ml-1.5 w-2 h-2 rounded-full" style={{ background: RED }} />
        </Link>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#E31C3D]/10 text-[#E31C3D] border border-[#E31C3D]/25">
          <span>PANEL ADMINISTRADOR</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 relative z-10 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>

      <div className="p-4 mt-auto relative z-10 border-t border-slate-200 dark:border-[#1C2B45]">
        <Link
          to="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-white/50 dark:hover:text-white dark:hover:bg-[#1C2B45]/50 transition-all rounded-xl w-full"
        >
          <LogOut className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-800 dark:text-white/40 dark:group-hover:text-white transition-colors" />
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
    <div className="flex h-screen w-screen overflow-hidden text-slate-800 dark:text-white transition-colors bg-[#F8FAFC] dark:bg-[#0B1220]">
      <aside className="hidden w-[260px] shrink-0 md:flex flex-col z-20 transition-colors bg-white dark:bg-[#0B1220] h-full">
        <SidebarContent currentPath={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        <header className="flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white dark:border-[#1C2B45] dark:bg-[#10182B] px-8 transition-colors shrink-0">
          <div className="flex items-center md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú" className="hover:bg-slate-100 text-slate-700 dark:hover:bg-[#1C2B45] dark:text-white rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] border-r border-slate-200 dark:border-[#1C2B45] bg-white dark:bg-[#0B1220] p-0 text-slate-900 dark:text-white">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menú Administrativo</SheetTitle>
                </SheetHeader>
                <SidebarContent currentPath={pathname} onLinkClick={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="ml-3 text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: FONT_DISPLAY }}>Fútbol Pulse</span>
          </div>

          <div className="hidden md:flex flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#E31C3D] bg-[#E31C3D]/10 px-3.5 py-1.5 border border-[#E31C3D]/25 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Panel de Administración
            </div>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Temporada Activa
            </div>

            <ThemeToggle />

            {user && (
              <Link to="perfil" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                {user.foto_perfil ? (
                  <img src={user.foto_perfil} alt="Perfil" className="h-10 w-10 rounded-full object-cover border-2 border-[#E31C3D]" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#E31C3D]/10 border-2 border-[#E31C3D] flex items-center justify-center text-[#E31C3D] font-extrabold text-sm shadow-md">
                    {(user.nombre_completo || user.username || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.nombre_completo || user.username}</p>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-white/50 uppercase">Administrador</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-white/40 rotate-90" />
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 transition-colors bg-[#F8FAFC] dark:bg-[#0B1220]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
