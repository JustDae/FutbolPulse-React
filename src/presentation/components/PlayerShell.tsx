import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LogOut, Menu, Activity, Calendar, MessageSquare, Zap } from 'lucide-react';
import { cn } from '@/presentation/utils/cn';
import { useAuthStore } from '../store/auth.store';
import { usePlayerStore } from '../store/player.store';
import { useMatchStore } from '../store/match.store';
import { ThemeToggle } from '@/presentation/components/ThemeToggle';
import { Button } from '@/presentation/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/presentation/components/ui/sheet';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Rendimiento',  href: '/jugador',          icon: Activity },
  { label: 'Partidos',     href: '/jugador/partidos', icon: Calendar },
  { label: 'Feedback',     href: '/jugador/feedback', icon: MessageSquare },
];

interface SideNavLinkProps {
  item: NavItem;
  currentPath: string;
  onClick?: () => void;
}

function SideNavLink({ item, currentPath, onClick }: SideNavLinkProps) {
  const isActive =
    item.href === '/jugador'
      ? currentPath === '/jugador'
      : currentPath.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 relative',
        isActive
          ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(227,28,61,0.3)] translate-x-1'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
      )}
    >
      <Icon className={cn('h-5 w-5', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary')} />
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
  const { logout, user } = useAuthStore();
  const { currentPlayer } = usePlayerStore();
  const { matches } = useMatchStore();

  const upcomingMatches = matches
    .filter(m => m.status === 'Programado')
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
  const nextMatch = upcomingMatches[0];

  const formatMatchDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const day = days[d.getDay()];
      const hours = String(d.getHours()).padStart(2, '0');
      const mins  = String(d.getMinutes()).padStart(2, '0');
      return `${day}, ${hours}:${mins}`;
    } catch { return dateStr; }
  };

  let opponentText   = 'vs. Rival Próximo';
  let matchTimeText  = 'Próximamente';
  let isHome         = true;

  if (nextMatch) {
    const local    = nextMatch.equipoLocal;
    const visiting = nextMatch.equipoVisitante;
    const team     = currentPlayer?.teamName || '';

    if (team && local.toLowerCase().includes(team.toLowerCase())) {
      opponentText = `vs. ${visiting}`; isHome = true;
    } else if (team && visiting.toLowerCase().includes(team.toLowerCase())) {
      opponentText = `vs. ${local}`;    isHome = false;
    } else {
      opponentText = `${local} vs. ${visiting}`;
    }
    matchTimeText = `${formatMatchDate(nextMatch.matchDate)} • ${isHome ? 'Local' : 'Visitante'}`;
  }

  const displayName = user?.nombre_completo || user?.username || 'Jugador';

  return (
    <div className="flex h-full flex-col glass-card relative overflow-hidden border-r-0 rounded-r-3xl my-4 ml-4">
      {/* Logo */}
      <div className="px-8 py-10 relative z-10 flex flex-col border-b border-border/50 mb-6">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-foreground text-3xl font-black tracking-tighter uppercase">
            FÚTBOL<span className="text-primary">PULSE</span>
          </span>
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70 mt-3 neon-text-glow">
          Portal Pro
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 px-4 relative z-10 overflow-y-auto custom-scrollbar">
        {navItems.map(item => (
          <SideNavLink key={item.href} item={item} currentPath={currentPath} onClick={onLinkClick} />
        ))}
      </nav>

      {/* Next match sidebar block */}
      <div className="p-4 mt-auto relative z-10 space-y-4">
        {nextMatch && (
          <div className="rounded-2xl bg-black/40 border border-white/5 p-5 mb-4 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase tracking-widest">
              Próximo Partido
            </p>
            <p className="text-sm font-black text-foreground">{opponentText}</p>
            <p className="text-xs text-primary mt-1.5 font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              {matchTimeText}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          className="flex items-center justify-start gap-4 rounded-xl px-4 py-4 text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full h-auto group"
          onClick={() => { logout(); onLinkClick?.(); }}
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
  const { currentPlayer, fetchCurrentPlayerByUserName } = usePlayerStore();
  const { fetchMatches } = useMatchStore();

  useEffect(() => {
    if (user?.nombre_completo) {
      fetchCurrentPlayerByUserName(user.nombre_completo);
    }
  }, [user, fetchCurrentPlayerByUserName]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const profilePhoto = (currentPlayer && currentPlayer.firstNames && user?.nombre_completo && user.nombre_completo.toLowerCase().includes(currentPlayer.firstNames.toLowerCase()))
    ? currentPlayer.photoUrl
    : (user?.foto_perfil || '');

  const displayName = user?.nombre_completo || user?.username || '';
  const playerBadge = 'Jugador Pro';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar desktop */}
      <aside className="hidden w-[280px] shrink-0 md:flex flex-col z-20 h-full">
        <SidebarContent currentPath={pathname} />
      </aside>

      {/* Sidebar mobile */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-[300px] border-r border-border/50 bg-background/95 backdrop-blur-xl p-0 text-foreground">
          <SheetHeader className="sr-only">
            <SheetTitle>Menú Jugador</SheetTitle>
          </SheetHeader>
          <SidebarContent currentPath={pathname} onLinkClick={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex h-24 items-center justify-between gap-4 glass mx-6 mt-4 rounded-2xl px-8 transition-colors shrink-0">
          {/* Left: hamburger + logo */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir menú"
              className="hover:bg-white/10 text-foreground"
              onClick={() => setSheetOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <span className="ml-4 text-lg font-black tracking-wide uppercase text-foreground">
              Fútbol<span className="text-primary">Pulse</span>
            </span>
          </div>

          {/* Left/Center: Clickable Badge */}
          <div className="hidden md:flex flex-1">
            <Link
              to="/jugador"
              className="text-sm font-bold text-muted-foreground bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-inner hover:text-foreground hover:bg-white/10 transition-all cursor-pointer"
            >
              Dashboard General
            </Link>
          </div>

          {/* Right: online + theme + profile */}
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
              <Link
                to="perfil"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity p-1.5 pr-4 rounded-full bg-white/5 border border-white/10"
              >
                <div className="relative h-10 w-10">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Perfil" className="h-full w-full rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-background" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-black shadow-sm ring-2 ring-primary/50">
                      {(displayName || 'J').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-black leading-none">{displayName}</p>
                  <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1">{playerBadge}</p>
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
