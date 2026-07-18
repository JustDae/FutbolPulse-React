import { useState, useEffect } from 'react';
import { Users, LayoutGrid, Loader2, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';

import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import type { Player } from '@/domain/entities/player.entity';
import type { Team } from '@/domain/entities/team.entity';
import { useAuthStore } from '@/presentation/store/auth.store';
import { toast } from 'sonner';
import { matchesCoach } from '@/presentation/utils/name.utils';

const playerRepo = new AxiosPlayerRepository();
const teamRepo = new AxiosTeamRepository();

interface PitchPlayer {
  player: Player;
  x: number; 
  y: number; 
}

const BG_CARD = '#0B0F19';
const BG_INNER = '#151D30';
const BORDER = 'rgba(255, 255, 255, 0.08)';

export function LineupBuilderPage() {
  const { user } = useAuthStore();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedRivalId, setSelectedRivalId] = useState<string>('');

  const [pitchPlayers, setPitchPlayers] = useState<PitchPlayer[]>([]);
  const [rivalPitchPlayers, setRivalPitchPlayers] = useState<PitchPlayer[]>([]);

  const [formation, setFormation] = useState('4-3-3');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedPlayers, fetchedTeams] = await Promise.all([
          playerRepo.getPlayers(),
          teamRepo.getTeams()
        ]);
        setPlayers(fetchedPlayers);
        setAllTeams(fetchedTeams);

        const isAdmin = user?.tipo_usuario?.toLowerCase() === 'admin' || user?.is_staff;
        let myTeams = fetchedTeams;

        if (!isAdmin && user?.nombre_completo) {
          myTeams = fetchedTeams.filter(t => 
            matchesCoach(t.coach, user.nombre_completo)
          );
        }

        setTeams(myTeams);

        if (myTeams.length > 0) {
          const firstTeamId = myTeams[0].id;
          setSelectedTeamId(firstTeamId);
          loadLineup(firstTeamId, fetchedPlayers);
        }
      } catch (error) {
        console.error('Error fetching data', error);
        toast.error('Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const loadLineup = (teamId: string, allPlayers: Player[]) => {
    try {
      const saved = localStorage.getItem(`lineup_${teamId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const restored = parsed.map((p: any) => ({
          x: p.x,
          y: p.y,
          player: allPlayers.find(ap => ap.id === p.playerId)
        })).filter((p: any) => p.player);
        setPitchPlayers(restored);
      } else {
        setPitchPlayers([]);
      }
    } catch (e) {
      setPitchPlayers([]);
    }
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tId = e.target.value;
    setSelectedTeamId(tId);
    loadLineup(tId, players);
  };

  const handleRivalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = e.target.value;
    setSelectedRivalId(rId);
    if (!rId) {
      setRivalPitchPlayers([]);
      return;
    }
    try {
      const saved = localStorage.getItem(`lineup_${rId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const restored = parsed.map((p: any) => ({
          x: 100 - p.x, 
          y: 100 - p.y, 
          player: players.find(ap => ap.id === p.playerId)
        })).filter((p: any) => p.player);
        setRivalPitchPlayers(restored);
        if (restored.length === 0) toast.info('El rival no tiene jugadores en cancha.');
      } else {
        setRivalPitchPlayers([]);
        toast.info('Este rival aún no ha guardado su alineación.');
      }
    } catch (err) {
      setRivalPitchPlayers([]);
    }
  };

  const saveLineup = () => {
    if (!selectedTeamId) return;
    const toSave = pitchPlayers.map(p => ({
      playerId: p.player.id,
      x: p.x,
      y: p.y
    }));
    localStorage.setItem(`lineup_${selectedTeamId}`, JSON.stringify(toSave));
    toast.success('Alineación guardada exitosamente');
  };

  const getFormationCoordinates = (form: string) => {
    const coords: {x: number, y: number}[] = [{ x: 50, y: 88 }];

    let defs = 4, mids = 3, fwds = 3;
    if (form === '4-4-2') { defs = 4; mids = 4; fwds = 2; }
    else if (form === '3-5-2') { defs = 3; mids = 5; fwds = 2; }
    else if (form === '4-2-3-1') { defs = 4; mids = 2; fwds = 1; }

    const distribute = (count: number, y: number) => {
      if (count === 1) return [{ x: 50, y }];
      if (count === 2) return [{ x: 35, y }, { x: 65, y }];
      if (count === 3) return [{ x: 25, y }, { x: 50, y }, { x: 75, y }];
      if (count === 4) return [{ x: 20, y }, { x: 40, y }, { x: 60, y }, { x: 80, y }];
      if (count === 5) return [{ x: 15, y }, { x: 32.5, y }, { x: 50, y }, { x: 67.5, y }, { x: 85, y }];
      return [];
    };

    coords.push(...distribute(defs, 65));
    if (form === '4-2-3-1') {
      coords.push(...distribute(2, 50));
      coords.push(...distribute(3, 35));
      coords.push(...distribute(1, 20));
    } else {
      coords.push(...distribute(mids, 45));
      coords.push(...distribute(fwds, 22));
    }

    return coords;
  };

  const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newForm = e.target.value;
    setFormation(newForm);

    if (pitchPlayers.length > 0) {
      const coords = getFormationCoordinates(newForm);
      setPitchPlayers(prev => {
        return prev.map((p, i) => {
          if (i < coords.length) {
            return { ...p, x: coords[i].x, y: coords[i].y };
          }
          return p;
        });
      });
      toast.info(`Alineación ajustada a ${newForm}`);
    }
  };

  const handleDragStart = (e: React.DragEvent, player: Player) => {
    e.dataTransfer.setData('playerId', player.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('playerId');

    let player;
    if (playerId === 'rival_template') {
      player = {
        id: `rival_${Date.now()}_${Math.random()}`,
        firstNames: 'Rival',
        lastNames: '',
        teamId: 'rival',
        jerseyNumber: 'X' as any,
      } as Player;
    } else {
      player = players.find(p => p.id === playerId);
    }

    if (player) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setPitchPlayers(prev => {
        const filtered = prev.filter(p => p.player.id !== playerId);
        return [...filtered, { player, x, y }];
      });
    }
  };

  const removePlayerFromPitch = (playerId: string) => {
    setPitchPlayers(prev => prev.filter(p => p.player.id !== playerId));
  };

  const teamPlayers = players.filter(p => p.teamId === selectedTeamId);
  const benchPlayers = teamPlayers.filter(
    p => !pitchPlayers.some(pp => pp.player.id === p.id)
  );

  return (
    <div className="flex-1 space-y-6 animate-fade-in pb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b" style={{ borderColor: BORDER }}>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pizarra Táctica</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 uppercase tracking-wider">
            Armado de Alineaciones
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 focus:border-slate-300 focus:outline-none transition-all shadow-sm"
            value={selectedTeamId}
            onChange={handleTeamChange}
            disabled={isLoading || teams.length === 0}
          >
            {teams.length === 0 ? <option value="">Sin equipos...</option> : null}
            {teams.map(t => (
              <option key={t.id} value={t.id} className="text-slate-800 bg-white">{t.name}</option>
            ))}
          </select>

          <button onClick={() => setPitchPlayers([])} className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
            Limpiar Cancha
          </button>
          <button onClick={saveLineup} className="flex items-center gap-2 rounded-lg bg-[#E31C3D] hover:bg-[#c61834] text-white px-4.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
            <Save className="h-4 w-4" /> Guardar
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="md:col-span-1 border border-white/10 text-white rounded-lg overflow-hidden flex flex-col" style={{ background: BG_CARD }}>
          <CardHeader className="border-b" style={{ borderColor: BORDER }}>
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-white">
              <Users className="h-4.5 w-4.5 text-[#E31C3D]" /> Plantilla ({benchPlayers.length})
            </CardTitle>
            <CardDescription className="text-white/40 text-[10px] uppercase font-semibold">Arrastra jugadores a la cancha</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              </div>
            ) : !selectedTeamId ? (
              <p className="text-xs text-white/30 text-center italic py-8">
                No tienes equipos asignados.
              </p>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div 
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('playerId', 'rival_template');
                  }}
                  className="p-3 rounded-lg border border-[#E31C3D]/20 bg-[#E31C3D]/5 hover:bg-[#E31C3D]/10 cursor-grab active:cursor-grabbing flex items-center justify-between transition-colors mb-2"
                >
                  <div>
                    <p className="font-bold text-xs leading-tight text-[#E31C3D] uppercase tracking-wider">Oponente (Rival)</p>
                    <p className="text-[9px] text-[#E31C3D]/60 mt-1 uppercase font-semibold">Ficha genérica</p>
                  </div>
                  <div className="h-7 w-7 shrink-0 rounded-full bg-[#E31C3D] text-white flex items-center justify-center font-bold text-xs">
                    X
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg border border-white/5" style={{ background: BG_INNER }}>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-2">Cargar Rival Específico:</p>
                  <select
                    className="w-full px-3 py-2 bg-[#0B0F19] text-white border border-white/10 rounded-md text-xs font-semibold outline-none focus:border-white/20 transition-all"
                    value={selectedRivalId}
                    onChange={handleRivalChange}
                  >
                    <option value="">Seleccionar rival...</option>
                    {allTeams.filter(t => t.id !== selectedTeamId).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-2 mt-4">
                  Tu Equipo ({benchPlayers.length})
                </div>

                {benchPlayers.length === 0 ? (
                  <p className="text-xs text-white/30 text-center italic py-8">
                    Sin jugadores en la banca.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {benchPlayers.map(player => (
                      <div 
                        key={player.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, player)}
                        className="p-3 rounded-lg border border-white/5 bg-[#151D30]/40 hover:bg-[#151D30]/80 cursor-grab active:cursor-grabbing flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-bold text-xs text-white uppercase tracking-wider leading-tight">{player.firstNames} {player.lastNames}</p>
                          <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-1">{player.position || 'Sin posición'}</p>
                        </div>
                        <div className="h-8 w-8 shrink-0 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                          {player.photoUrl ? (
                            <img src={player.photoUrl} alt={player.firstNames} className="h-full w-full object-cover" />
                          ) : (
                            player.jerseyNumber || '-'
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3 border border-white/10 text-white rounded-lg overflow-hidden flex flex-col" style={{ background: BG_CARD }}>
          <CardHeader className="flex flex-row items-center justify-between border-b" style={{ borderColor: BORDER }}>
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-white">
                <LayoutGrid className="h-4.5 w-4.5 text-[#E31C3D]" /> Pizarra Táctica
              </CardTitle>
              <CardDescription className="text-white/40 text-[10px] uppercase font-semibold">Jugadores en cancha: {pitchPlayers.length}/11</CardDescription>
            </div>
            <select 
              className="px-3 py-1.5 bg-[#151D30] text-white border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer outline-none focus:border-white/20 transition-all"
              value={formation}
              onChange={handleFormationChange}
            >
              <option value="4-3-3">4-3-3</option>
              <option value="4-4-2">4-4-2</option>
              <option value="3-5-2">3-5-2</option>
              <option value="4-2-3-1">4-2-3-1</option>
            </select>
          </CardHeader>
          <CardContent className="p-4">
            <div 
              className="relative w-full aspect-[2/3] md:aspect-[16/10] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center"
              style={{ background: '#0F1E15' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 150"
                preserveAspectRatio="none"
                style={{ opacity: 0.25 }}
              >
                <rect x="4" y="4" width="92" height="142" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                <line x1="4" y1="75" x2="96" y2="75" stroke="#FFFFFF" strokeWidth="0.8" />
                <circle cx="50" cy="75" r="14" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                <circle cx="50" cy="75" r="1" fill="#FFFFFF" />
                <rect x="23" y="4" width="54" height="22" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                <rect x="36" y="4" width="28" height="9" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                <rect x="23" y="124" width="54" height="22" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                <rect x="36" y="137" width="28" height="9" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
              </svg>

              {pitchPlayers.length === 0 && (
                <div className="text-white/40 text-xs font-semibold uppercase tracking-wider pointer-events-none z-0">
                  Área de arrastrar y soltar (Drag & Drop)
                </div>
              )}

              {[...pitchPlayers, ...rivalPitchPlayers].map(({ player, x, y }) => {
                const isGenericRival = player.teamId === 'rival';
                const isLoadedRival = rivalPitchPlayers.some(rp => rp.player.id === player.id);
                const isRival = isGenericRival || isLoadedRival;
                const isDraggable = !isLoadedRival;

                return (
                  <div
                    key={player.id}
                    className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group z-10 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    draggable={isDraggable}
                    onDragStart={(e) => isDraggable && handleDragStart(e, player)}
                  >
                    <div className="relative">
                      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white/60 shadow-lg flex items-center justify-center font-bold text-xs md:text-sm overflow-hidden ${
                        isRival ? 'bg-[#E31C3D] text-white' : 'bg-slate-700 text-white'
                      }`}>
                        {player.photoUrl && !isGenericRival ? (
                          <img src={player.photoUrl} alt={player.firstNames} className="h-full w-full object-cover" />
                        ) : (
                          player.jerseyNumber || '-'
                        )}
                      </div>
                      {isDraggable && (
                        <button 
                          onClick={() => removePlayerFromPitch(player.id)}
                          className="absolute -top-1 -right-1 h-4 w-4 bg-[#E31C3D] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className={`mt-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm whitespace-nowrap text-center max-w-[90px] truncate ${
                      isRival ? 'bg-[#E31C3D]/80 text-white' : 'bg-slate-900/80 text-white'
                    }`}>
                      {player.lastNames || player.firstNames}
                    </div>
                  </div>
                );
              })}

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
