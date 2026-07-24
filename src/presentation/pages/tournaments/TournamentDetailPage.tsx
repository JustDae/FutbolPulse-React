import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Medal, Trophy } from 'lucide-react';
import { useTournamentStore } from '../../store/tournament.store';

const RED = '#E63946';
const OFF_WHITE = '#F4F4F5';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

export function TournamentDetailPage() {
  const { id } = useParams();
  const { tournaments, fetchTournaments, isLoading } = useTournamentStore();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const tournament = tournaments.find((t) => t.id === id);

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
          Cargando detalles del torneo...
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 p-12 bg-white">
          Torneo no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-20 text-slate-800" style={{ background: OFF_WHITE, fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-14 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute right-10 bottom-0 opacity-10 select-none pointer-events-none hidden md:block">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '180px', lineHeight: 1 }}>LEAGUE</span>
        </div>
        
        <div className="max-w-[1300px] mx-auto flex flex-col relative z-10">
          <Link to="/torneos" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 w-fit transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Volver a Torneos
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Detalle de Torneo</span>
            <span
              className="font-bold text-[8px] uppercase tracking-widest px-3 py-1"
              style={{
                background: tournament.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                color: tournament.isActive ? '#10B981' : '#64748B',
              }}
            >
              {tournament.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <h1
            className="uppercase text-white mt-1 leading-none"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
          >
            {tournament.name}
          </h1>
          <p className="text-white/40 text-xs mt-3 max-w-md font-medium">
            Entidad organizadora: {tournament.nombreEntidad || 'Desconocida'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid gap-8 md:grid-cols-3 mt-12">
        
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Card: Detalles del Torneo */}
          <div className="bg-white border border-slate-200" style={{ borderRadius: '0px' }}>
            <div className="h-[3px] w-full" style={{ background: RED }} />
            <div className="p-8">
              <h3 className="text-slate-900 uppercase font-black tracking-tight mb-6" style={{ fontFamily: FONT_DISPLAY, fontSize: '24px' }}>
                Reglas y Categoría
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">Género</span>
                  <span className="font-bold text-slate-800 text-sm">{tournament.gender || 'Masculino'}</span>
                </div>
                <div className="bg-slate-50 p-4 border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">Categoría de Edad</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {tournament.minAge ? `${tournament.minAge} a ${tournament.maxAge || 'Sin límite'} años` : 'Libre'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8 mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <Medal className="h-6 w-6" style={{ color: RED }} />
                  <h4 className="font-bold uppercase tracking-widest text-sm text-slate-800">Tabla de Posiciones</h4>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">En preparación</p>
                  <p className="text-slate-500 text-sm max-w-sm">La tabla de posiciones se activará automáticamente cuando se registren los primeros resultados oficiales del torneo.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Card: Sedes */}
          <div className="bg-white border border-slate-200" style={{ borderRadius: '0px' }}>
            <div className="h-[3px] w-full bg-slate-900" />
            <div className="p-8">
              <h3 className="text-slate-900 uppercase font-black tracking-tight mb-2" style={{ fontFamily: FONT_DISPLAY, fontSize: '24px' }}>
                Sedes Oficiales
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">Lugares donde se disputarán los encuentros.</p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 border border-slate-100">
                  <div className="h-2 w-2 rounded-full" style={{ background: RED }} />
                  Estadio Principal
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 border border-slate-100">
                  <div className="h-2 w-2 rounded-full" style={{ background: RED }} />
                  Canchas Auxiliares Norte
                </li>
              </ul>
            </div>
          </div>

          {/* Card: Inscripción */}
          <div className="border border-slate-200 relative overflow-hidden" style={{ borderRadius: '0px', background: '#0B1220' }}>
            <div className="h-[3px] w-full" style={{ background: RED }} />
            <div className="p-8 text-center relative z-10">
              <Trophy className="h-12 w-12 mx-auto mb-4" style={{ color: RED }} />
              <h3 className="text-white uppercase font-black tracking-tight mb-3" style={{ fontFamily: FONT_DISPLAY, fontSize: '24px' }}>
                ¿Quieres participar?
              </h3>
              <p className="text-white/60 text-xs font-medium mb-8 leading-relaxed">
                Contacta con la entidad organizadora para gestionar la inscripción de tu club en este torneo.
              </p>
              <button
                className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90 cursor-pointer"
                style={{ background: RED, color: '#FFF' }}
              >
                Contacto de Soporte
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
