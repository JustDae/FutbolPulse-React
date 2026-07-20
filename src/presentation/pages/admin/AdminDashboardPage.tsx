import { useEffect, useState } from 'react';
import { CalendarDays, Shield, Trophy, Users } from 'lucide-react';
import type { AdminStats } from '@/domain/entities/admin-stats.entity';
import { dashboardUseCase } from '@/infrastructure/factories/dashboard.factory';
import { Card } from '@/presentation/components/ui/card';

const statConfig = [
  {
    key: 'totalTeams',
    label: 'Equipos totales',
    description: 'Clubes creados en la base de datos',
    icon: Shield,
  },
  {
    key: 'activeTeams',
    label: 'Equipos activos',
    description: 'Equipos habilitados para torneos',
    icon: Shield,
  },
  {
    key: 'totalPlayers',
    label: 'Jugadores registrados',
    description: 'Atletas con ficha federativa activa',
    icon: Users,
  },
  {
    key: 'totalMatches',
    label: 'Partidos registrados',
    description: 'Encuentros totales en la temporada',
    icon: CalendarDays,
  },
  {
    key: 'pendingMatches',
    label: 'Partidos pendientes',
    description: 'Encuentros pendientes de juego',
    icon: CalendarDays,
  },
  {
    key: 'activeTournaments',
    label: 'Torneos activos',
    description: 'Competiciones oficiales en curso',
    icon: Trophy,
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
      <div className="py-20 text-center text-white/50 font-bold uppercase tracking-widest text-xs">
        Cargando estadísticas del dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-l-4 border-[#E31C3D] bg-[#E31C3D]/10 text-[#E31C3D] text-xs font-bold uppercase tracking-wider rounded-r-xl">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-[#1C2B45] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E31C3D] rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Panel de Control
            </h1>
          </div>
          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium pl-5">Resumen operativo general de la plataforma deportiva.</p>
        </div>


      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statConfig.map(({ key, label, description, icon: Icon }) => (
          <Card 
            key={key} 
            className="group relative overflow-hidden bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] hover:border-[#E31C3D]/50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            style={{ minHeight: '160px' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E31C3D] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider">{label}</span>
              <div className="p-2.5 bg-slate-100 dark:bg-[#1C2B45]/50 text-[#E31C3D] rounded-xl border border-slate-200 dark:border-[#1C2B45] group-hover:bg-[#E31C3D] group-hover:text-white transition-colors">
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {stats[key]}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-white/40 text-right max-w-[160px]">
                {description}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
