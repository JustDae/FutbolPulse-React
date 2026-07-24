import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { ArrowLeft, User, MapPin } from 'lucide-react';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import type { Team } from '@/domain/entities/team.entity';
import type { Player } from '@/domain/entities/player.entity';

const teamRepository = new AxiosTeamRepository();
const playerRepository = new AxiosPlayerRepository();

const NAVY = '#0B1220';
const RED = '#E63946';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

export function TeamDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const isCoach = user?.tipo_usuario === 'Coach';

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      teamRepository.getTeamById(id),
      playerRepository.getPlayersByTeam(id).catch(() => [])
    ])
      .then(([fetchedTeam, fetchedPlayers]) => {
        setTeam(fetchedTeam);
        setPlayers(fetchedPlayers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const getPlayerPosition = (player: Player): 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero' => {
    if (player.position) return player.position;

    const nameLower = player.name.toLowerCase();
    if (
      nameLower.includes('neuer') || 
      nameLower.includes('baumann') || 
      nameLower.includes('alisson') || 
      nameLower.includes('nübel') || 
      nameLower.includes('galíndez') ||
      player.jerseyNumber === 1 || 
      player.jerseyNumber === 12
    ) {
      return 'Portero';
    }
    if (
      nameLower.includes('danilo') || 
      nameLower.includes('hincapié') || 
      nameLower.includes('gabriel') || 
      nameLower.includes('magalhães') ||
      player.jerseyNumber === 3 || 
      player.jerseyNumber === 4 || 
      player.jerseyNumber === 6 ||
      player.jerseyNumber === 13
    ) {
      return 'Defensa';
    }
    if (
      nameLower.includes('kendry') || 
      nameLower.includes('paez') || 
      nameLower.includes('caicedo') ||
      player.jerseyNumber === 8 || 
      player.jerseyNumber === 10
    ) {
      return 'Mediocampista';
    }
    return 'Delantero';
  };

  const getAge = (dateString: string) => {
    if (!dateString) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-white">
        <p className="font-bold uppercase tracking-widest text-xs">Cargando...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1220] text-white p-6">
        <p className="font-bold uppercase tracking-widest text-xs mb-4" style={{ color: RED }}>Equipo no encontrado</p>
        <Link to="/equipos" className="text-xs uppercase tracking-widest font-bold border border-white/20 px-6 py-3 hover:bg-white/5 transition-all">
          Volver al directorio
        </Link>
      </div>
    );
  }

  const gks = players.filter(p => getPlayerPosition(p) === 'Portero');
  const defs = players.filter(p => getPlayerPosition(p) === 'Defensa');
  const mids = players.filter(p => getPlayerPosition(p) === 'Mediocampista');
  const fwds = players.filter(p => getPlayerPosition(p) === 'Delantero');

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 pb-24" style={{ fontFamily: "'Inter', sans-serif" }}>

      {}
      <div className="text-white pt-10 pb-20 relative overflow-hidden" style={{ background: NAVY }}>

        {}
        {team.badgeUrl && (
          <div 
            className="absolute top-0 left-0 w-full sm:w-[50%] h-full z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${team.badgeUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              filter: 'blur(6px)',
            }}
          />
        )}

        {}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ 
            background: `linear-gradient(to right, rgba(11,18,32,0.7) 0%, rgba(11,18,32,0.9) 50%, ${NAVY} 100%)`,
          }}
        />

        {}
        <div className="absolute right-10 bottom-0 opacity-10 select-none pointer-events-none hidden md:block z-10">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '180px', lineHeight: 1 }}>
            {team.name.toUpperCase()}
          </span>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">

          {}
          <Link
            to="/equipos"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors group mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Volver a Equipos</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">

              {}
              <div 
                className="w-32 aspect-[3/2] bg-slate-900 flex items-center justify-center shrink-0 border border-white/10 shadow-2xl relative translate-y-16 z-20 overflow-hidden"
              >
                {team.badgeUrl ? (
                  <img src={team.badgeUrl} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 font-bold text-3xl" style={{ fontFamily: FONT_DISPLAY }}>
                    {team.name.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>
                  Club Oficial
                </span>
                <h1
                  className="uppercase text-white mt-1 leading-none font-black tracking-tight"
                  style={{ fontFamily: FONT_DISPLAY, fontSize: '56px', letterSpacing: '-0.02em' }}
                >
                  {team.name}
                </h1>

                {}
                <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-widest mt-2 font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-white/30" />
                  <span>{team.stadium || 'Estadio oficial'}</span>
                </div>
              </div>

            </div>

            {isCoach && (
              <Link
                to="/coach/equipos"
                className="inline-flex items-center gap-2 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 self-start md:self-auto relative z-20"
                style={{ background: RED }}
              >
                Editar Información
              </Link>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="h-10 bg-[#0B1220]" />

      {}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-14 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">

        {}
        <div className="space-y-12">

          {}
          <div>
            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Estrategia</span>
              <h2 className="uppercase text-white text-2xl font-black mt-0.5" style={{ fontFamily: FONT_DISPLAY }}>
                Alineación Táctica
              </h2>
            </div>

            {players.length > 0 ? (
              <div
                className="w-full h-[400px] relative overflow-hidden border border-white/10 shadow-2xl"
                style={{

                  background: 'repeating-linear-gradient(90deg, #142a15 0px, #142a15 50px, #1a351c 50px, #1a351c 100px)',
                }}
              >
                {}
                <div className="absolute inset-4 border border-white/20 pointer-events-none">
                  {}
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20" />
                  {}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full" />

                  {}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-14 border-b border-x border-white/20" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 border-b border-x border-white/20" />
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full" />

                  {}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-14 border-t border-x border-white/20" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 border-t border-x border-white/20" />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full" />

                  {}
                  <div className="absolute top-0 left-0 w-3 h-3 border-b border-r border-white/20 rounded-br-full" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-b border-l border-white/20 rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-t border-r border-white/20 rounded-tr-full" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-t border-l border-white/20 rounded-tl-full" />
                </div>

                {}

                {}
                {fwds.map((p, idx) => (
                  <div
                    key={p.id}
                    className="absolute flex flex-col items-center -translate-x-1/2 z-10 transition-transform hover:scale-105"
                    style={{
                      bottom: '80%',
                      left: `${((idx + 1) * 100) / (fwds.length + 1)}%`,
                    }}
                  >
                    <TacticalNode player={p} />
                  </div>
                ))}

                {}
                {mids.map((p, idx) => (
                  <div
                    key={p.id}
                    className="absolute flex flex-col items-center -translate-x-1/2 z-10 transition-transform hover:scale-105"
                    style={{
                      bottom: '55%',
                      left: `${((idx + 1) * 100) / (mids.length + 1)}%`,
                    }}
                  >
                    <TacticalNode player={p} />
                  </div>
                ))}

                {}
                {defs.map((p, idx) => (
                  <div
                    key={p.id}
                    className="absolute flex flex-col items-center -translate-x-1/2 z-10 transition-transform hover:scale-105"
                    style={{
                      bottom: '30%',
                      left: `${((idx + 1) * 100) / (defs.length + 1)}%`,
                    }}
                  >
                    <TacticalNode player={p} />
                  </div>
                ))}

                {}
                {gks.map((p, idx) => (
                  <div
                    key={p.id}
                    className="absolute flex flex-col items-center -translate-x-1/2 z-10 transition-transform hover:scale-105"
                    style={{
                      bottom: '5%',
                      left: `${((idx + 1) * 100) / (gks.length + 1)}%`,
                    }}
                  >
                    <TacticalNode player={p} />
                  </div>
                ))}

              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-white/10 bg-slate-900/20">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Alineación en preparación</p>
              </div>
            )}
          </div>

          {}
          <div>
            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Catálogo</span>
              <h2 className="uppercase text-white text-xl font-black mt-0.5" style={{ fontFamily: FONT_DISPLAY }}>
                Lista de Roster
              </h2>
            </div>

            {players.length > 0 ? (
              <div className="overflow-x-auto border border-white/10 shadow-lg">
                <table className="min-w-full divide-y divide-white/5 text-left text-xs bg-slate-950/20">
                  <thead className="bg-[#121E36]/80 uppercase font-black text-slate-300 tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-20">Dorsal</th>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Posición</th>
                      <th className="px-6 py-4">Edad</th>
                      <th className="px-6 py-4">Pie Hábil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                    {players.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-black text-white text-sm">#{p.jerseyNumber}</td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center border border-white/10">
                            {p.photoUrl ? (
                              <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <span className="font-bold text-white">{p.name}</span>
                        </td>
                        <td className="px-6 py-4 uppercase text-[10px] tracking-wider text-slate-400 font-bold">
                          {getPlayerPosition(p)}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-400">{getAge(p.birthDate)}</td>
                        <td className="px-6 py-4 uppercase text-[10px] font-medium text-slate-400">{p.pieDominante || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

        </div>

        {}
        <div className="space-y-6">
          <div className="border border-white/10 bg-[#121E36]/40 p-6 flex flex-col" style={{ borderTop: `4px solid ${RED}`, borderRadius: '0px' }}>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: RED }}>Perfil</span>
            <h2 className="uppercase text-white text-xl font-black mb-6 mt-0.5 pb-3 border-b border-white/15" style={{ fontFamily: FONT_DISPLAY }}>
              Ficha Técnica
            </h2>

            <div className="space-y-5">
              {[
                { label: 'Director Técnico', value: team.coach || 'Sin asignar' },
                { label: 'Estadio Principal', value: team.stadium || 'Sin asignar' },
                { label: 'Año de Fundación', value: team.foundedYear || 'N/A' },
                { label: 'Estado', value: team.isActive ? 'Activo en competencia' : 'Inactivo', highlight: team.isActive },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
                  <p 
                    className="text-base font-black text-white uppercase tracking-tight mt-1" 
                    style={{ 
                      fontFamily: FONT_DISPLAY,
                      color: item.highlight ? '#10B981' : undefined 
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function TacticalNode({ player }: { player: Player }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {}
        <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white/80 overflow-hidden flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
          {player.photoUrl ? (
            <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
          ) : (

            <svg viewBox="0 0 24 24" className="w-7 h-7 text-slate-300 fill-slate-800" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 3L8 5L9 4L12 7L15 4L16 5L18 3L21 6V11L19 12V21H5V12L3 11V6L6 3Z" />
            </svg>
          )}
        </div>

        {}
        <div
          className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-slate-900 shadow-sm"
          style={{ background: RED }}
        >
          {player.jerseyNumber}
        </div>
      </div>

      {}
      <span className="text-[9px] font-black text-white bg-slate-950/90 border border-white/20 px-2 py-0.5 mt-1.5 rounded-none uppercase tracking-widest text-center truncate max-w-[80px] shadow-lg">
        {player.name.split(' ')[0]}
      </span>
    </div>
  );
}
