import { useState, useEffect } from 'react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { Plus, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import type { Team } from '@/domain/entities/team.entity';

const teamRepository = new AxiosTeamRepository();

const RED = '#E63946';
const OFF_WHITE = '#F4F4F5';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";
import { TeamBadge } from '@/presentation/components/TeamBadge';

export function TeamsPage() {
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    teamRepository.getTeams().then(setTeams).catch(console.error);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-20 text-slate-800" style={{ background: OFF_WHITE, fontFamily: "'Inter', sans-serif" }}>

      {}
      <div className="bg-slate-950 text-white py-14 px-6 md:px-12 relative overflow-hidden">
        {}
        <div className="absolute right-10 bottom-0 opacity-10 select-none pointer-events-none hidden md:block">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '180px', lineHeight: 1 }}>CLUBS</span>
        </div>

        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Directorio Oficial</span>
            <h1
              className="uppercase text-white mt-1 leading-none"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.02em' }}
            >
              DIRECTORIO<br />DE EQUIPOS
            </h1>
            <p className="text-white/40 text-xs mt-3 max-w-md font-medium">
              Explora las plantillas oficiales, sedes deportivas, años de fundación y la gestión técnica de cada club.
            </p>
          </div>

          {isCoach && (
            <Link
              to="/coach/equipos"
              className="inline-flex items-center gap-3 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90 shrink-0 self-start md:self-auto"
              style={{ background: RED, color: '#FFF' }}
            >
              <Plus className="w-4 h-4" /> Registrar Equipo
            </Link>
          )}
        </div>
      </div>

      {}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex flex-col bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl group"
            style={{ borderRadius: '0px' }}
          >
            <div className="h-28 flex items-center justify-center border-b border-slate-100" style={{ background: '#F8FAFC' }}>
              <div
                className="w-24 aspect-[3/2] overflow-hidden shadow-sm"
                style={{ borderRadius: '0px' }}
              >
                <TeamBadge url={team.badgeUrl} name={team.name} size={96} />
              </div>
            </div>

            {}
            <div className="p-6 flex-1 flex flex-col items-center">

              {}
              <h3
                className="text-slate-900 uppercase font-black tracking-tight text-center leading-tight mb-2"
                style={{ fontFamily: FONT_DISPLAY, fontSize: '22px' }}
              >
                {team.name}
              </h3>

              {}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-5">
                <MapPin className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                <span>{team.stadium || 'Sede no asignada'}</span>
              </div>

              {}
              <div className="w-full space-y-2.5 border-t border-slate-100 pt-4 mt-auto">

                {}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Director Técnico</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[120px]" title={team.coach}>
                    {team.coach || 'Sin DT'}
                  </span>
                </div>

                {}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Fundación</span>
                  <span className="font-semibold text-slate-700">{team.foundedYear || 'N/A'}</span>
                </div>

                {}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Estado</span>
                  <span
                    className="font-bold text-[10px] uppercase tracking-wider"
                    style={{ color: team.isActive ? '#10B981' : '#94A3B8' }}
                  >
                    {team.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

              </div>

              {}
              <Link
                to={`/equipos/${team.id}`}
                className="mt-6 flex items-center justify-center gap-2 w-full text-[10px] font-bold uppercase tracking-widest py-3.5 border transition-all text-slate-700 border-slate-200 hover:border-transparent hover:text-white"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED; (e.currentTarget as HTMLElement).style.color = '#FFF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#334155'; }}
              >
                Ver Plantilla <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>
          </div>
        ))}

        {teams.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 bg-white">
            Aún no hay equipos registrados en el sistema.
          </div>
        )}
      </div>
    </div>
  );
}
