import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Button } from './ui/button';
import { LayoutDashboard, Users, Star, FileText } from 'lucide-react';
import { cn } from '../utils/cn';

export function ScoutShell() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user || user.tipo_usuario !== 'Scout') {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/scout', icon: LayoutDashboard },
    { name: 'Jugadores', href: '/scout/jugadores', icon: Users },
    { name: 'Prospectos', href: '/scout/prospectos', icon: Star },
    { name: 'Reportes', href: '/scout/reportes', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-muted/40">
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Portal Scout</h2>
          <p className="text-sm text-muted-foreground">{user.username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start', isActive && 'font-semibold')}
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
