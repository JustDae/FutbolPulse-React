import { useState, useEffect } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Plus, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Match } from '@/domain/entities/match.entity';
import { useTeamStore } from '@/presentation/store/team.store';

const RED = '#E31C3D';
const OFF_WHITE = '#F4F4F5';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

export function MatchesPage() {
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';
  const [matches, setMatches] = useState<Match[]>([]);
  const { teams, fetchTeams } = useTeamStore();

  useEffect(() => {
    fetchTeams();
    matchRepository.getMatches().then(setMatches).catch(console.error);
  }, [fetchTeams]);

  const getTeamBadge = (teamName: string) => {
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase() || t.name.toLowerCase().includes(teamName.toLowerCase()) || teamName.toLowerCase().includes(t.name.toLowerCase()));
    return team?.badgeUrl || '';
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-20 text-slate-800" style={{ background: OFF_WHITE, fontFamily: "'Inter', sans-serif" }}>

      {}
      <div className="bg-slate-950 text-white py-14 px-6 md:px-12 relative overflow-hidden">
        {}
        <div className="absolute right-10 bottom-0 opacity-10 select-none pointer-events-none hidden md:block">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '180px', lineHeight: 1 }}>MATCHES</span>
        </div>

        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Calendario Oficial</span>
            <h1
              className="uppercase text-white mt-1 leading-none"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
            >
              CALENDARIO<br />DE PARTIDOS
            </h1>
            <p className="text-white/40 text-xs mt-3 max-w-md font-medium">
              Revisa los partidos programados, resultados en tiempo real y el histórico de competiciones.
            </p>
          </div>

          {isCoach && (
            <Link
              to="/coach"
              className="inline-flex items-center gap-3 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90 shrink-0 self-start md:self-auto"
              style={{ background: RED, color: '#FFF' }}
            >
              <Plus className="w-4 h-4" /> Programar Partido
            </Link>
          )}
        </div>
      </div>

      {}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex flex-col bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl group"
            style={{ borderRadius: '0px' }}
          >
            {}
            <div className="p-6 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">

              {}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-20 h-[52px] flex items-center justify-center bg-white border border-slate-200 shadow-sm overflow-hidden" style={{ borderRadius: '0px' }}>
                  {getTeamBadge(match.equipoLocal) ? (
                    <img src={getTeamBadge(match.equipoLocal)} alt={match.equipoLocal} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 font-bold text-xs uppercase" style={{ fontFamily: FONT_DISPLAY }}>{match.equipoLocal.substring(0, 3)}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 text-center leading-tight max-w-[80px] truncate">{match.equipoLocal}</span>
              </div>

              {}
              <div className="flex flex-col items-center px-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{match.status}</span>
                {match.status === 'Finalizado' || match.status === 'En curso' ? (
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '36px', color: '#0F172A', lineHeight: 1 }}>{match.homeScore ?? 0}</span>
                    <span className="text-slate-300 text-xl font-light">:</span>
                    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '36px', color: '#0F172A', lineHeight: 1 }}>{match.awayScore ?? 0}</span>
                  </div>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 bg-slate-200/50 text-slate-500 uppercase tracking-wider">VS</span>
                )}
              </div>

              {}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-20 h-[52px] flex items-center justify-center bg-white border border-slate-200 shadow-sm overflow-hidden" style={{ borderRadius: '0px' }}>
                  {getTeamBadge(match.equipoVisitante) ? (
                    <img src={getTeamBadge(match.equipoVisitante)} alt={match.equipoVisitante} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 font-bold text-xs uppercase" style={{ fontFamily: FONT_DISPLAY }}>{match.equipoVisitante.substring(0, 3)}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 text-center leading-tight max-w-[80px] truncate">{match.equipoVisitante}</span>
              </div>

            </div>

            {}
            <div className="p-6 flex-1 flex flex-col">

              {}
              <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: RED }}>{match.matchType || 'Liga Profesional'}</span>
              <h3
                className="text-slate-900 uppercase font-black tracking-tight mt-1.5 mb-4"
                style={{ fontFamily: FONT_DISPLAY, fontSize: '20px' }}
              >
                {match.equipoLocal} vs {match.equipoVisitante}
              </h3>

              {}
              <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">

                {}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="truncate">{match.stadium || 'Estadio por definir'}</span>
                </div>

                {}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Calendar className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="capitalize">{new Date(match.matchDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>{new Date(match.matchDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} HS</span>
                </div>

              </div>

              {}
              <Link
                to={`/partidos/${match.id}`}
                className="mt-6 flex items-center justify-center gap-2 w-full text-[10px] font-bold uppercase tracking-widest py-3.5 border transition-all text-slate-700 border-slate-200 hover:border-transparent hover:text-white"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED; (e.currentTarget as HTMLElement).style.color = '#FFF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#334155'; }}
              >
                Ver Detalles <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 bg-white">
            Aún no hay partidos programados.
          </div>
        )}
      </div>
    </div>
  );
}
