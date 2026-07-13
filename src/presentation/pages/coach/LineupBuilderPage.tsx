import { useState, useEffect } from 'react';
import { Users, LayoutGrid, Loader2, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import type { Player } from '@/domain/entities/player.entity';
import type { Team } from '@/domain/entities/team.entity';
import { useAuthStore } from '@/presentation/store/auth.store';
import { toast } from 'sonner';

const playerRepo = new AxiosPlayerRepository();
const teamRepo = new AxiosTeamRepository();

interface PitchPlayer {
  player: Player;
  x: number; 
  y: number; 
}

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
            t.coach && t.coach.toLowerCase().includes(user.nombre_completo.toLowerCase())
          );
          
          
          if (myTeams.length === 0) {
            myTeams = fetchedTeams;
            toast.info('No tienes equipos asignados a tu nombre. Mostrando todos los equipos por ahora.');
          }
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
        
        const filtered = playerId.startsWith('rival_') && playerId !== 'rival_template' 
          ? prev.filter(p => p.player.id !== playerId)
          : prev.filter(p => p.player.id !== playerId);
        
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Armado de Alineaciones</h2>
          <p className="text-sm text-muted-foreground">Configura la pizarra táctica para cada equipo</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            className="px-3 py-2 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-ring"
            value={selectedTeamId}
            onChange={handleTeamChange}
            disabled={isLoading || teams.length === 0}
          >
            {teams.length === 0 ? <option value="">Sin equipos...</option> : null}
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <Button variant="outline" onClick={() => setPitchPlayers([])}>Limpiar Cancha</Button>
          <Button onClick={saveLineup} className="gap-2">
            <Save className="h-4 w-4" /> Guardar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" /> Plantilla ({benchPlayers.length})
            </CardTitle>
            <CardDescription>Arrastra jugadores a la cancha</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !selectedTeamId ? (
              <p className="text-sm text-muted-foreground text-center italic py-4">
                Selecciona un equipo primero.
              </p>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                <div 
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('playerId', 'rival_template');
                  }}
                  className="p-3 border rounded-md bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 border-red-200 dark:border-red-900 cursor-grab active:cursor-grabbing flex items-center justify-between shadow-sm transition-colors mb-2"
                >
                  <div>
                    <p className="font-medium text-sm leading-tight text-red-700 dark:text-red-400">Oponente (Rival)</p>
                    <p className="text-xs text-red-500 mt-0.5">Ficha genérica</p>
                  </div>
                  <div className="h-8 w-8 shrink-0 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                    X
                  </div>
                </div>
                
                <div className="mb-4 p-3 border rounded-md bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Cargar Rival Específico:</p>
                  <select
                    className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-ring"
                    value={selectedRivalId}
                    onChange={handleRivalChange}
                  >
                    <option value="">Seleccionar equipo rival...</option>
                    {allTeams.filter(t => t.id !== selectedTeamId).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">
                  Tu Equipo ({benchPlayers.length})
                </div>

                {benchPlayers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center italic py-4">
                    No hay jugadores disponibles en la banca de este equipo.
                  </p>
                ) : (
                  benchPlayers.map(player => (
                    <div 
                      key={player.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, player)}
                      className="p-3 border rounded-md bg-card hover:bg-muted/50 cursor-grab active:cursor-grabbing flex items-center justify-between shadow-sm transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm leading-tight">{player.firstNames} {player.lastNames}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{player.position || 'Sin posición'}</p>
                      </div>
                      <div className="h-8 w-8 shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">
                        {player.jerseyNumber || '-'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <LayoutGrid className="h-5 w-5" /> Pizarra Táctica
              </CardTitle>
              <CardDescription>Jugadores en cancha: {pitchPlayers.length}/11</CardDescription>
            </div>
            <select 
              className="px-3 py-1 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-ring"
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
            >
              <option value="4-3-3">4-3-3</option>
              <option value="4-4-2">4-4-2</option>
              <option value="3-5-2">3-5-2</option>
            </select>
          </CardHeader>
          <CardContent>
            <div 
              className="relative w-full aspect-[2/3] md:aspect-[16/10] bg-green-700 rounded-lg overflow-hidden border-2 border-white/20 shadow-inner flex items-center justify-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="absolute inset-4 border-2 border-white/30 rounded-sm pointer-events-none"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 pointer-events-none md:top-0 md:bottom-0 md:left-1/2 md:right-auto md:w-0.5 md:h-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full pointer-events-none"></div>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/30 pointer-events-none md:left-4 md:top-1/2 md:-translate-y-1/2 md:w-24 md:h-48 md:border-l-0 md:border-b-2"></div>
              
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/30 pointer-events-none md:left-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:w-24 md:h-48 md:border-r-0 md:border-t-2"></div>

              {pitchPlayers.length === 0 && (
                <div className="text-white/50 text-center font-semibold pointer-events-none z-0">
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
                      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-sm md:text-base ${
                        isRival ? 'bg-red-600 text-white' : 'bg-primary text-primary-foreground'
                      }`}>
                        {player.jerseyNumber || '-'}
                      </div>
                      {isDraggable && (
                        <button 
                          onClick={() => removePlayerFromPitch(player.id)}
                          className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className={`mt-1 text-[10px] md:text-xs px-2 py-0.5 rounded shadow-sm whitespace-nowrap text-center max-w-[80px] truncate ${
                      isRival ? 'bg-red-900/80 text-white' : 'bg-black/60 text-white'
                    }`}>
                      {player.firstNames.split(' ')[0]} {player.lastNames.split(' ')[0]}
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
