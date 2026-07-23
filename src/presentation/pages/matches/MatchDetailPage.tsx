import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { useMatchStore } from '@/presentation/store/match.store';
import { useTeamStore } from '@/presentation/store/team.store';
import { TeamBadge } from '@/presentation/components/TeamBadge';
import { ArrowLeft, Clock, Edit2, Shield, Activity, Users } from 'lucide-react';

const RED = '#E31C3D';
const OFF_WHITE = '#F4F4F5';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

export function MatchDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';
  
  const { matches, fetchMatches, isLoading } = useMatchStore();
  const { teams, fetchTeams } = useTeamStore();

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, [fetchMatches, fetchTeams]);

  const match = matches.find((m) => m.id === id);

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
          Cargando detalles del partido...
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 p-12 bg-white">
          Partido no encontrado
        </div>
      </div>
    );
  }

  const isLive = match.status === 'En curso';
  const hasFinished = match.status === 'Finalizado';

  const localTeam = teams.find(t => t.id === match.equipoLocal || t.name === match.equipoLocal);
  const awayTeam = teams.find(t => t.id === match.equipoVisitante || t.name === match.equipoVisitante);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-20 text-slate-800" style={{ background: OFF_WHITE, fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-14 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute right-10 bottom-0 opacity-10 select-none pointer-events-none hidden md:block">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '180px', lineHeight: 1 }}>MATCH</span>
        </div>
        
        <div className="max-w-[1300px] mx-auto flex flex-col relative z-10">
          <div className="flex justify-between items-start mb-6">
            <Link to="/partidos" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver a Partidos
            </Link>
            {isCoach && (
              <button
                className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" /> Actualizar Resultado
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Detalle de Partido</span>
            <span
              className={`font-bold text-[8px] uppercase tracking-widest px-3 py-1 ${isLive ? 'animate-pulse' : ''}`}
              style={{
                background: isLive ? 'rgba(227, 28, 61, 0.15)' : 'rgba(255,255,255,0.1)',
                color: isLive ? RED : '#FFF',
              }}
            >
              {match.status} {isLive && match.liveMinute ? `• ${match.liveMinute}'` : ''}
            </span>
          </div>
          <h1
            className="uppercase text-white mt-1 leading-none max-w-2xl"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
          >
            {match.equipoLocal} VS {match.equipoVisitante}
          </h1>
          <div className="flex items-center gap-6 mt-4">
            <p className="text-white/40 text-xs font-medium flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> {new Date(match.matchDate).toLocaleString()}
            </p>
            <p className="text-white/40 text-xs font-medium flex items-center gap-2 border-l border-white/10 pl-6">
              <Shield className="w-3.5 h-3.5" /> {match.stadium || 'Estadio por definir'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Scoreboard */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 -mt-8 relative z-20">
        <div className="bg-white border border-slate-200 shadow-2xl" style={{ borderRadius: '0px' }}>
          <div className="h-[4px] w-full" style={{ background: RED }} />
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            
            <div className="flex-1 text-center md:text-right w-full flex flex-col md:flex-row items-center justify-end gap-6">
              <h2 className="uppercase font-black text-slate-900 tracking-tight leading-none truncate" style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(28px, 4vw, 48px)' }}>
                {match.equipoLocal}
              </h2>
              <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden drop-shadow-md bg-slate-100 flex-shrink-0">
                <TeamBadge url={localTeam?.badgeUrl} name={match.equipoLocal} size={96} />
              </div>
            </div>

            <div className="shrink-0 bg-slate-950 px-8 py-4 flex items-center justify-center min-w-[160px] shadow-inner">
              <span className="text-white font-black tracking-tight" style={{ fontFamily: FONT_DISPLAY, fontSize: '48px' }}>
                {(hasFinished || isLive) ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}` : 'VS'}
              </span>
            </div>

            <div className="flex-1 text-center md:text-left w-full flex flex-col-reverse md:flex-row items-center justify-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden drop-shadow-md bg-slate-100 flex-shrink-0">
                <TeamBadge url={awayTeam?.badgeUrl} name={match.equipoVisitante} size={96} />
              </div>
              <h2 className="uppercase font-black text-slate-900 tracking-tight leading-none truncate" style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(28px, 4vw, 48px)' }}>
                {match.equipoVisitante}
              </h2>
            </div>
            
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid gap-8 md:grid-cols-2 mt-8">
        
        {/* Alineaciones */}
        <div className="bg-white border border-slate-200" style={{ borderRadius: '0px' }}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900 uppercase font-black tracking-tight flex items-center gap-3" style={{ fontFamily: FONT_DISPLAY, fontSize: '24px' }}>
                <Users className="w-5 h-5" style={{ color: RED }} /> Alineaciones
              </h3>
            </div>
            
            <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Aún no confirmadas</p>
              <p className="text-slate-500 text-sm max-w-sm mb-6">Los directores técnicos no han publicado las alineaciones oficiales para este encuentro.</p>
              {isCoach && (
                <button
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ background: RED, color: '#FFF' }}
                >
                  Definir Alineación
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Evaluación / Eventos */}
        <div className="bg-white border border-slate-200" style={{ borderRadius: '0px' }}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900 uppercase font-black tracking-tight flex items-center gap-3" style={{ fontFamily: FONT_DISPLAY, fontSize: '24px' }}>
                <Activity className="w-5 h-5" style={{ color: RED }} /> Evaluación / Eventos
              </h3>
            </div>
            
            <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Sin registros</p>
              <p className="text-slate-500 text-sm max-w-sm mb-6">No hay eventos destacados ni evaluaciones técnicas registradas en este momento.</p>
              {isCoach && (
                <button
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors border border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 cursor-pointer bg-white"
                >
                  Registrar Eventos
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
