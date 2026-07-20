import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LogOut, Menu, CalendarDays, Users, UserPlus, ClipboardList, Activity, MonitorPlay, ShieldAlert } from 'lucide-react';
import { cn } from '@/presentation/utils/cn';
import { useAuthStore } from '../store/auth.store';

const NAVY = '#0B1220';
const NAVY_MID = '#10182B';
const NAVY_LIGHT = '#1C2B45';
const RED = '#E31C3D';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Panel Principal', href: '/coach', icon: CalendarDays },
  { label: 'Equipos', href: '/coach/equipos', icon: Users },
  { label: 'Jugadores', href: '/coach/jugadores', icon: UserPlus },
  { label: 'Alineaciones', href: '/coach/alineaciones', icon: ClipboardList },
  { label: 'Salud', href: '/coach/salud', icon: Activity },
  { label: 'En Vivo', href: '/coach/live', icon: MonitorPlay },
  { label: 'Evaluaciones', href: '/coach/evaluaciones', icon: ShieldAlert },
];

interface SideNavLinkProps {
  item: NavItem;
  currentPath: string;
  onClick?: () => void;
}

function SideNavLink({ item, currentPath, onClick }: SideNavLinkProps) {
  const isActive =
    item.href === '/coach' ? currentPath === '/coach' : currentPath.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-4 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 relative border-l-[3px]',
        isActive
          ? 'text-white'
          : 'text-white/40 hover:text-white/80 border-transparent',
      )}
      style={{
        borderLeftColor: isActive ? RED : 'transparent',
        background: isActive ? NAVY_LIGHT : 'transparent',
      }}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-white/30 group-hover:text-white/70")} />
      <span>{item.label}</span>
    </Link>
  );
}

interface SidebarContentProps {
  currentPath: string;
  onLinkClick?: () => void;
}

function SidebarContent({ currentPath, onLinkClick }: SidebarContentProps) {
  const { logout, user } = useAuthStore();

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: NAVY_MID, borderRight: `1px solid rgba(255,255,255,0.06)` }}
    >
      {}
      <div className="px-6 py-8 border-b border-white/5">
        <Link to="/" className="flex items-center gap-0">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '22px', color: RED, letterSpacing: '-0.01em', lineHeight: 1 }}>
            FÚTBOL
          </span>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '22px', color: '#FFF', letterSpacing: '-0.01em', lineHeight: 1 }}>
            PULSE
          </span>
          <span className="ml-1.5 w-1.5 h-1.5 shrink-0" style={{ background: RED }} />
        </Link>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Panel Técnico
        </p>
      </div>

      {}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>

      {}
      <div className="border-t border-white/5 p-4 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: RED }}
            >
              {(user.nombre_completo || user.username || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-none truncate max-w-[140px]">
                {user.nombre_completo || user.username}
              </p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest mt-0.5">DT Principal</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); onLinkClick?.(); }}
          className="flex items-center gap-3 w-full px-2 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors text-white/30 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function CoachShell() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="dark flex h-screen w-screen overflow-hidden text-foreground" style={{ background: NAVY }}>

      {}
      <aside className="hidden w-64 shrink-0 md:flex flex-col z-20 h-full">
        <SidebarContent currentPath={pathname} />
      </aside>

      {}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full z-10">
            <SidebarContent currentPath={pathname} onLinkClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {}
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">

        {}
        <header
          className="flex h-16 items-center justify-between px-6 md:px-8 shrink-0"
          style={{ background: NAVY_MID, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {}
          <div className="flex items-center gap-4">
            <button
              className="flex md:hidden text-white/50 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5" style={{ background: RED }} />
                <span
                  className="uppercase font-bold text-white/50 text-[10px] tracking-[0.15em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {navItems.find(i => i.href === pathname || (i.href !== '/coach' && pathname.startsWith(i.href)))?.label ?? 'Panel de Control'}
                </span>
              </div>
              {(user?.is_staff || user?.tipo_usuario === 'Admin') && (
                <Link
                  to="/admin"
                  className="text-xs font-extrabold text-white bg-[#E31C3D] hover:bg-[#c61834] px-4 py-1.5 rounded-full shadow-lg shadow-[#E31C3D]/25 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Panel Administrador
                </Link>
              )}
            </div>
          </div>

          {}
          <div className="flex items-center gap-4">
            {}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-white/8 text-[9px] font-bold uppercase tracking-[0.15em] text-white/35" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="w-1.5 h-1.5" style={{ background: '#22C55E' }} />
              En línea
            </div>

            {}
            {user && (
              <Link
                to="perfil"
                className="flex items-center gap-3 px-3 py-1.5 border border-white/10 hover:border-white/25 transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: RED }}
                >
                  {(user.nombre_completo || user.username || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-white text-[11px] font-semibold leading-none">
                    {user.nombre_completo || user.username}
                  </p>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest mt-0.5">DT Principal</p>
                </div>
              </Link>
            )}
          </div>
        </header>

        {}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
