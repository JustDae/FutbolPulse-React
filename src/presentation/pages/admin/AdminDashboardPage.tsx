import { useEffect, useState } from 'react';
import { CalendarDays, Shield, Trophy, Users } from 'lucide-react';

import type { AdminStats } from '@/domain/entities/admin-stats.entity';
import { dashboardUseCase } from '@/infrastructure/factories/dashboard.factory';
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
    className: 'text-blue-600',
  },
  {
    key: 'activeTeams',
    label: 'Equipos activos',
    icon: Shield,
    className: 'text-emerald-600',
  },
  {
    key: 'totalPlayers',
    label: 'Jugadores registrados',
    icon: Users,
    className: 'text-violet-600',
  },
  {
    key: 'totalMatches',
    label: 'Partidos registrados',
    icon: CalendarDays,
    className: 'text-amber-600',
  },
  {
    key: 'pendingMatches',
    label: 'Partidos pendientes',
    icon: CalendarDays,
    className: 'text-orange-600',
  },
  {
    key: 'activeTournaments',
    label: 'Torneos activos',
    icon: Trophy,
    className: 'text-rose-600',
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
    return <div className="p-6 text-gray-500">Cargando estadísticas del dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard administrativo</h1>
        <p className="text-sm text-gray-500">Resumen general del estado del torneo y la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statConfig.map(({ key, label, icon: Icon, className }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${className}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats[key]}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
