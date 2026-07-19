import { useEffect, useState } from 'react';
import { CalendarDays, Shield, Trophy, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { AdminStats } from '@/domain/entities/admin-stats.entity';
import { dashboardUseCase } from '@/infrastructure/factories/dashboard.factory';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

const statConfig = [
  {
    key: 'totalTeams',
    label: 'Equipos totales',
    icon: Shield,
    description: 'Clubes creados en la base de datos',
  },
  {
    key: 'activeTeams',
    label: 'Equipos activos',
    icon: Shield,
    description: 'Equipos habilitados para torneos',
  },
  {
    key: 'totalPlayers',
    label: 'Jugadores registrados',
    icon: Users,
    description: 'Atletas con ficha federativa activa',
  },
  {
    key: 'totalMatches',
    label: 'Partidos registrados',
    icon: CalendarDays,
    description: 'Encuentros totales en la temporada',
  },
  {
    key: 'pendingMatches',
    label: 'Partidos pendientes',
    icon: CalendarDays,
    description: 'Encuentros pendientes de juego',
  },
  {
    key: 'activeTournaments',
    label: 'Torneos activos',
    icon: Trophy,
    description: 'Competiciones oficiales en curso',
  },
] as const;

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      try {
        const adminStats = await dashboardUseCase.getAdminStats();
        if (mounted) {
          setStats(adminStats);
        }
      } catch (caughtError) {
        if (mounted) {
          setError(caughtError instanceof Error ? caughtError.message : 'No se pudieron cargar las estadísticas');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-zinc-500">
        Cargando estadísticas del dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Panel de Control
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Resumen general y acceso rápido a las funciones principales.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SISTEMA ACTIVO
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm transition-all duration-200 active:scale-95 gap-2">
            <Link to="/admin/perfil">
              <Settings className="h-4 w-4" />
              AJUSTES
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {statConfig.map(({ key, label, icon: Icon, description }) => (
          <Card 
            key={key} 
            className="border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:shadow-red-500/5 hover:-translate-y-0.5 transition-all duration-200 bg-card"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</CardTitle>
              <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats[key]}</div>
              <p className="text-[11px] text-zinc-400 mt-2 font-medium">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

