import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { UserAvatar } from './UserAvatar'
import { useState, useEffect } from 'react'
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository'
import type { Match } from '@/domain/entities/match.entity'
import { Menu, X } from 'lucide-react'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center h-full px-5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors relative',
    isActive
      ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#E31C3D]'
      : 'text-white/60 hover:text-white',
  ].join(' ')
}

export function AppShell() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [matches, setMatches] = useState<Match[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    matchRepository.getMatches()
      .then(m => setMatches(m.slice(0, 8)))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const tickerItems = matches.length > 0
    ? matches.map(m =>
        `${m.equipoLocal.toUpperCase()} ${m.homeScore ?? '–'} : ${m.awayScore ?? '–'} ${m.equipoVisitante.toUpperCase()}`
      )
    : ['FÚTBOLPULSE — GESTIÓN DEPORTIVA PROFESIONAL', 'ESTADÍSTICAS EN TIEMPO REAL', 'ANÁLISIS DE RENDIMIENTO']

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#F4F4F5' }}>

      {}
      <div className="w-full overflow-hidden h-8 flex items-center" style={{ background: '#E31C3D' }}>
        <div className="flex items-center h-full px-4 shrink-0 border-r border-white/20" style={{ background: '#0B1220' }}>
          <span className="text-white text-[9px] font-bold tracking-[0.2em] uppercase blink-live">● EN VIVO</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-track whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="text-white text-[10px] font-bold tracking-widest uppercase inline-block px-8">
                {item} <span className="text-white/40 mx-4">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {}
      <header className="sticky top-0 z-50 w-full h-16" style={{ background: '#0B1220', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-full h-full flex items-center px-6 md:px-10 gap-6">

          {}
          <Link to="/" className="flex items-center gap-0 shrink-0 group">
            <span
              className="font-display font-black italic text-2xl tracking-tight uppercase"
              style={{ color: '#E31C3D', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.01em' }}
            >
              FÚTBOL
            </span>
            <span
              className="font-display font-black italic text-2xl tracking-tight uppercase"
              style={{ color: '#FFFFFF', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.01em' }}
            >
              PULSE
            </span>
            {}
            <span className="ml-1.5 w-2 h-2 shrink-0" style={{ background: '#E31C3D' }} />
          </Link>

          {}
          <nav className="hidden md:flex items-center h-full ml-2 gap-1">
            <NavLink to="/torneos" className={navLinkClass}>Torneos</NavLink>
            <NavLink to="/equipos" className={navLinkClass}>Equipos</NavLink>
            <NavLink to="/partidos" className={navLinkClass}>Partidos</NavLink>
            <NavLink to="/estadisticas" className={navLinkClass}>Estadísticas</NavLink>
          </nav>

          <div className="flex-1" />

          {}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-3 py-1.5 border border-white/10 hover:border-white/30 transition-colors">
                    <UserAvatar user={user} size="sm" />
                    <div className="hidden sm:block text-left">
                      <p className="text-white text-xs font-semibold leading-none">{user.nombre_completo || user.username || 'Usuario'}</p>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">{(user.is_staff || user.tipo_usuario === 'Admin') ? 'Admin' : 'Miembro'}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-white/10" style={{ background: '#10182B', color: '#FFF' }}>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-white">{user.nombre_completo || user.username || 'Usuario'}</p>
                      <p className="text-xs text-white/40 truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {(user.is_staff || user.tipo_usuario === 'Admin') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                          Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/coach" className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                      Panel Técnico
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-[#E31C3D] focus:text-[#E31C3D] focus:bg-[#E31C3D]/10"
                  >
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="text-[10px] font-bold uppercase tracking-[0.15em] px-6 h-9 hover:opacity-90 transition-opacity"
                style={{ background: '#E31C3D', color: '#FFF', borderRadius: 0 }}
              >
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            )}

            {}
            <button
              className="flex md:hidden text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 w-full z-40 border-t border-white/10" style={{ background: '#10182B' }}>
            {[
              { to: '/torneos', label: 'Torneos' },
              { to: '/equipos', label: 'Equipos' },
              { to: '/partidos', label: 'Partidos' },
              { to: '/estadisticas', label: 'Estadísticas' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 text-sm font-bold uppercase tracking-widest border-b border-white/5 transition-colors ${isActive ? 'text-[#E31C3D]' : 'text-white/70 hover:text-white'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {}
      <main className="flex-1">
        <Outlet />
      </main>

      {}
      <footer style={{ background: '#0B1220', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-0 mb-4">
              <span className="font-display font-black italic text-xl uppercase" style={{ color: '#E31C3D', fontFamily: "'Barlow Condensed', sans-serif" }}>FÚTBOL</span>
              <span className="font-display font-black italic text-xl uppercase" style={{ color: '#FFF', fontFamily: "'Barlow Condensed', sans-serif" }}>PULSE</span>
              <span className="ml-1 w-2 h-2" style={{ background: '#E31C3D' }} />
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              Plataforma de gestión deportiva profesional. Estadísticas, alineaciones y análisis de rendimiento.
            </p>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4">Navegación</p>
            <div className="space-y-2">
              {[['/', 'Inicio'], ['/torneos', 'Torneos'], ['/equipos', 'Equipos'], ['/partidos', 'Partidos'], ['/estadisticas', 'Estadísticas']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-white/40 text-xs font-medium hover:text-white transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4">Acceso</p>
            <div className="space-y-2">
              {[['/login', 'Iniciar sesión'], ['/register', 'Registrarse'], ['/coach', 'Panel Técnico'], ['/admin', 'Panel Admin']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-white/40 text-xs font-medium hover:text-white transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 px-6 md:px-10 flex items-center justify-between">
          <p className="text-white/20 text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} FútbolPulse
          </p>
          <div className="w-16 h-[2px]" style={{ background: '#E31C3D' }} />
        </div>
      </footer>
    </div>
  )
}
