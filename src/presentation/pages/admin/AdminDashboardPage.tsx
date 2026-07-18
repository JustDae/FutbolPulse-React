import { useEffect, useState } from 'react';
import { CalendarDays, Shield, Trophy, Users, Settings } from 'lucide-react';
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
      <div className="py-20 text-center text-slate-400 font-semibold uppercase tracking-wider text-xs">
        Cargando estadísticas del dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-l-4 border-[#E31C3D] bg-red-50 text-[#E31C3D] text-xs font-semibold uppercase tracking-wider rounded-r-lg">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 text-sm mt-1">Resumen general y acceso rápido a las funciones principales.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50/80 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-lg">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Sistema Activo</span>
          </div>
          <button 
            className="flex items-center gap-2 bg-[#E31C3D] hover:bg-[#c61834] text-white rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
          >
            <Settings className="h-4 w-4" />
            <span>Ajustes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statConfig.map(({ key, label, description, icon: Icon }) => (
          <Card 
            key={key} 
            className="bg-white border border-slate-200/85 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            style={{ minHeight: '150px' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-normal">{label}</span>
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {stats[key]}
              </span>
              <span className="text-[11px] font-medium text-slate-400 text-right max-w-[160px]">
                {description}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
