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


function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center h-full px-4 text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-[#e63946]',
    isActive ? 'text-[#e63946] border-b-2 border-[#e63946]' : 'text-slate-500 border-b-2 border-transparent',
  ].join(' ')
}

export function AppShell() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full h-16 bg-white border-b border-slate-200 flex items-center shadow-sm">
        
        {/* Logo Section (Dark Block) */}
        <div className="h-full flex items-center bg-black skew-x-[-15deg] -ml-4 pl-4 overflow-hidden border-r-4 border-[#e63946]">
          <Link
            to="/"
            className="flex items-center justify-center h-full px-8 skew-x-[15deg] font-black text-xl italic tracking-tighter hover:scale-105 transition-transform"
          >
            <span className="text-[#e63946] mr-1">FÚTBOL</span> 
            <span className="text-white">PULSE</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center h-full ml-4">
          <NavLink to="/torneos" className={navLinkClass}>
            Torneos
          </NavLink>
          <NavLink to="/equipos" className={navLinkClass}>
            Equipos
          </NavLink>
          <NavLink to="/partidos" className={navLinkClass}>
            Partidos
          </NavLink>
        </nav>

        <div className="flex-1" />

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Menú de usuario">
                    <UserAvatar user={user} size="sm" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{user.nombre_completo || user.username || 'Usuario'}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {user.is_staff && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          Panel Deportivo
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="bg-black hover:bg-slate-800 text-white rounded-none tracking-widest text-[10px] uppercase font-bold px-6">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            )}
          </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Fútbol Pulse &copy; {new Date().getFullYear()} - Gestión Deportiva
      </footer>
    </div>
  )
}
