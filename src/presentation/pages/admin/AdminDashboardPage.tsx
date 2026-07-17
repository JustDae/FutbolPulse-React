import { useEffect, useState } from 'react';
import { CalendarDays, Shield, Trophy, Users, Settings } from 'lucide-react';

import type { AdminStats } from '@/domain/entities/admin-stats.entity';
import { dashboardUseCase } from '@/infrastructure/factories/dashboard.factory';
import {
  Card,
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
    <div className="space-y-8 animate-fade-in pb-12 p-6">
      {/* Clean SaaS Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Panel de Control</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Resumen general y acceso rápido a las funciones principales.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-[#101010] border border-gray-200 dark:border-white/5 px-4 py-2.5 shadow-sm">
            <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Sistema Activo</span>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-[#f94116] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e03a13] shadow-md">
            <Settings className="h-4 w-4" />
            Ajustes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-none shadow-sm dark:shadow-none rounded-2xl overflow-hidden flex flex-col justify-between p-5 transition-transform hover:scale-[1.02]">
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-500 dark:text-[#888888]">
                 <Icon className="h-4 w-4" />
                 <span className="text-xs font-medium">{label}</span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {stats[key]}
              </div>
              
              {/* Fake Trend Indicator */}
              <div className="flex items-center gap-1 rounded bg-gray-100 dark:bg-[#101010] px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                +2.1%
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
