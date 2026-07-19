import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom'
import { Trophy, LogOut, LayoutDashboard } from 'lucide-react'
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
import { Separator } from '@/presentation/components/ui/separator'
import { UserAvatar } from './UserAvatar'


function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'text-sm font-medium transition-colors hover:text-primary',
    isActive ? 'text-primary' : 'text-muted-foreground',
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-primary"
          >
            <Trophy className="h-5 w-5" />
            <span>Fútbol Pulse</span>
          </Link>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          <nav className="hidden md:flex items-center gap-4">
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
                          <LayoutDashboard className="h-4 w-4" />
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
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            )}
          </div>
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
