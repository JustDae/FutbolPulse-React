import { useState, useEffect } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AxiosTournamentRepository } from '@/infrastructure/adapters/axios-tournament.repository';
import type { Tournament } from '@/domain/entities/tournament.entity';

const tournamentRepo = new AxiosTournamentRepository();

const RED = '#E63946';
const OFF_WHITE = '#F4F4F5';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

export function TournamentsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.tipo_usuario === 'Admin';
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    tournamentRepo.getTournaments().then(setTournaments).catch(console.error);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-20 text-slate-800" style={{ background: OFF_WHITE, fontFamily: "'Inter', sans-serif" }}>

      {}
      <div className="bg-slate-950 text-white py-14 px-6 md:px-12 relative overflow-hidden">
        {}
        <div className="absolute right-10 bottom-0 opacity-10 select-none pointer-events-none hidden md:block">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '180px', lineHeight: 1 }}>LEAGUES</span>
        </div>

        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Competiciones Oficiales</span>
            <h1
              className="uppercase text-white mt-1 leading-none"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
            >
              CENTRAL<br />DE TORNEOS
            </h1>
            <p className="text-white/40 text-xs mt-3 max-w-md font-medium">
              Sigue de cerca el desarrollo de los torneos activos, posiciones en tiempo real e históricos.
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin/torneos"
              className="inline-flex items-center gap-3 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90 shrink-0 self-start md:self-auto"
              style={{ background: RED, color: '#FFF' }}
            >
              <Plus className="w-4 h-4" /> Crear Torneo
            </Link>
          )}
        </div>
      </div>

      {}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-12">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="flex flex-col bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl group relative"
            style={{ borderRadius: '0px' }}
          >
            {}
            <div className="h-[3px] w-full" style={{ background: RED }} />

            {}
            <div className="p-8 flex-1 flex flex-col">

              {}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Torneo Oficial</span>
                <span
                  className="font-bold text-[8px] uppercase tracking-widest px-3 py-1"
                  style={{
                    background: t.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                    color: t.isActive ? '#10B981' : '#64748B',
                  }}
                >
                  {t.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {}
              <h3
                className="text-slate-900 uppercase font-black tracking-tight leading-tight mb-8"
                style={{ fontFamily: FONT_DISPLAY, fontSize: '24px' }}
              >
                {t.name}
              </h3>

              {}
              <div className="w-full space-y-3 border-t border-slate-100 pt-5 mt-auto">

                {}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Género</span>
                  <span className="font-bold text-slate-800">{t.gender || 'Masculino'}</span>
                </div>

                {}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Categoría</span>
                  <span className="font-bold text-slate-800">
                    {t.minAge ? `${t.minAge} - ${t.maxAge || 'Sin límite'} años` : 'Libre'}
                  </span>
                </div>

              </div>

              {}
              <Link
                to={`/torneos/${t.id}`}
                className="mt-8 flex items-center justify-center gap-2 w-full text-[10px] font-bold uppercase tracking-widest py-3.5 border transition-all text-slate-700 border-slate-200 hover:border-transparent hover:text-white"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED; (e.currentTarget as HTMLElement).style.color = '#FFF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#334155'; }}
              >
                Ver Fixture y Tablas <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>
          </div>
        ))}

        {tournaments.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 bg-white">
            Aún no hay torneos registrados en el sistema.
          </div>
        )}
      </div>
    </div>
  );
}
