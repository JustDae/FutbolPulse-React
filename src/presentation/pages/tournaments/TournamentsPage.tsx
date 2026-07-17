import { useState, useEffect } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Button } from '@/presentation/components/ui/button';
import { Trophy, Users, CalendarRange } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AxiosTournamentRepository } from '@/infrastructure/adapters/axios-tournament.repository';
import type { Tournament } from '@/domain/entities/tournament.entity';

const tournamentRepo = new AxiosTournamentRepository();

export function TournamentsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.tipo_usuario === 'Admin';
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    tournamentRepo.getTournaments().then(setTournaments).catch(console.error);
  }, []);

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 -mt-6 bg-slate-50 min-h-[calc(100vh-4rem)] pb-12">
      {/* Header ESPN Style */}
      <div className="bg-slate-900 text-white py-12 px-6 md:px-12 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-sm">
            Central de <span className="text-emerald-500">Torneos</span>
          </h2>
          <p className="text-slate-400 mt-2 font-medium">Sigue de cerca todas las competiciones activas e históricas.</p>
        </div>
        
        {isAdmin && (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none uppercase tracking-widest text-xs font-bold px-6 py-6 skew-x-[-10deg] relative z-10">
            <span className="skew-x-[10deg] flex items-center">
              <Trophy className="mr-2 h-4 w-4" /> Crear Torneo
            </span>
          </Button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {tournaments.map((t, index) => {
          const colors = [
            { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
            { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
            { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
            { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
          ];
          const color = colors[index % 4];

          return (
            <div key={t.id} className="bg-white rounded shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 border border-slate-100 group">
              <div className={`h-24 ${color.bg} border-b ${color.border} relative flex justify-center items-end pb-4`}>
                <div className={`absolute -bottom-8 w-16 h-16 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center ${color.text} z-10`}>
                  <Trophy className="h-8 w-8" />
                </div>
              </div>
              
              <div className="p-6 pt-12 flex-1 flex flex-col items-center text-center">
                <h3 className="text-slate-900 font-bold text-lg mb-2">{t.name}</h3>
                
                <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 ${
                  t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {t.isActive ? 'Activo' : 'Inactivo'}
                </span>

                <div className="mt-auto pt-4 border-t border-slate-100 w-full flex flex-col gap-2 px-2">
                   <div className="flex items-center text-xs text-slate-500 font-medium justify-between">
                     <span className="flex items-center"><Users className="mr-1 h-3 w-3"/> Género</span>
                     <span className="font-bold text-slate-700">{t.gender || 'Masculino'}</span>
                   </div>
                   <div className="flex items-center text-xs text-slate-500 font-medium justify-between">
                     <span className="flex items-center"><CalendarRange className="mr-1 h-3 w-3"/> Edades</span>
                     <span className="font-bold text-slate-700">
                       {t.minAge ? `${t.minAge} - ${t.maxAge || 'Sin límite'} años` : 'Libre'}
                     </span>
                   </div>
                </div>
                
                <Link to={`/torneos/${t.id}`} className="mt-6 flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-3 transition-colors">
                  Ver Fixture y Tablas <span className="ml-2 text-emerald-500">&gt;</span>
                </Link>
              </div>
            </div>
          );
        })}

        {tournaments.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Aún no hay torneos registrados en el sistema.
          </div>
        )}
      </div>
    </div>
  );
}
