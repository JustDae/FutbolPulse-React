import { useState, useEffect } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Button } from '@/presentation/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Match } from '@/domain/entities/match.entity';

export function MatchesPage() {
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    matchRepository.getMatches().then(setMatches).catch(console.error);
  }, []);

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 -mt-6 bg-slate-50 min-h-[calc(100vh-4rem)] pb-12">
      {/* Header ESPN Style */}
      <div className="bg-slate-900 text-white py-12 px-6 md:px-12 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e63946] rounded-full blur-[100px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-sm">
            Calendario de <span className="text-[#e63946]">Partidos</span>
          </h2>
          <p className="text-slate-400 mt-2 font-medium">Revisa los encuentros programados y los resultados finales.</p>
        </div>
        
        {isCoach && (
          <Button className="bg-[#e63946] hover:bg-[#d62828] text-white rounded-none uppercase tracking-widest text-xs font-bold px-6 py-6 skew-x-[-10deg] relative z-10">
            <span className="skew-x-[10deg] flex items-center">
              <CalendarPlus className="mr-2 h-4 w-4" /> Programar Partido
            </span>
          </Button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {matches.map((match, index) => {
          const colors = [
            { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
            { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
            { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
          ];
          const colorHome = colors[index % 3];
          const colorAway = { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' };

          return (
            <div key={match.id} className="bg-white rounded shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 text-slate-900 border border-slate-100">
              <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-200">
                 <div className={`w-16 h-16 rounded-full ${colorHome.bg} border ${colorHome.border} flex items-center justify-center font-black ${colorHome.text} shadow-sm text-lg`}>
                   {match.equipoLocal.substring(0, 3).toUpperCase()}
                 </div>
                 <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                     {match.status}
                   </span>
                   {match.status === 'Finalizado' ? (
                     <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
                       <span>{match.homeScore ?? 0}</span>
                       <span className="text-slate-300">-</span>
                       <span>{match.awayScore ?? 0}</span>
                     </div>
                   ) : (
                     <span className="text-sm font-bold text-slate-300">v</span>
                   )}
                 </div>
                 <div className={`w-16 h-16 rounded-full ${colorAway.bg} border ${colorAway.border} flex items-center justify-center font-black ${colorAway.text} shadow-sm text-lg`}>
                   {match.equipoVisitante.substring(0, 3).toUpperCase()}
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-slate-900 font-bold text-lg mb-1">{match.equipoLocal} v {match.equipoVisitante}</h3>
                <p className="text-xs text-slate-500 font-semibold mb-4">{match.matchType || 'Liga Profesional'}</p>
                <div className="mt-auto space-y-1 pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-400">{match.stadium || 'Sede Por Definir'}</p>
                  <p className="text-xs font-medium text-slate-400 capitalize">
                    {new Date(match.matchDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs font-medium text-slate-400">
                    {new Date(match.matchDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <Link to={`/partidos/${match.id}`} className="mt-6 flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-3 transition-colors">
                  Ver Detalles <span className="ml-2 text-[#e63946]">&gt;</span>
                </Link>
              </div>
            </div>
          );
        })}
        {matches.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Aún no hay partidos programados.
          </div>
        )}
      </div>
    </div>
  );
}

