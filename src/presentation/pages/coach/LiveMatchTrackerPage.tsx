import { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, AlertCircle, LayoutGrid, Clock, Pause, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Player } from '@/domain/entities/player.entity';
import type { Team } from '@/domain/entities/team.entity';
import type { Match } from '@/domain/entities/match.entity';
import { toast } from 'sonner';

const playerRepo = new AxiosPlayerRepository();
const teamRepo = new AxiosTeamRepository();

interface PitchPlayer {
  player: Player;
  x: number;
  y: number;
}

interface MatchEvent {
  id: string;
  type: string;
  player: Player;
  minute: number;
  period: string;
}

export function LiveMatchTrackerPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [pitchPlayers, setPitchPlayers] = useState<PitchPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Match State
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchTime, setMatchTime] = useState(0); // in seconds
  const [period, setPeriod] = useState<'Previo' | '1T' | 'ET' | '2T' | 'Final'>('Previo');
  const [stoppageTime, setStoppageTime] = useState<number>(0);
  
  
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [selectedPlayerForEvent, setSelectedPlayerForEvent] = useState<Player | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedPlayers, fetchedTeams, fetchedMatches] = await Promise.all([
          playerRepo.getPlayers(),
          teamRepo.getTeams(),
          matchRepository.getMatches()
        ]);
        setAllPlayers(fetchedPlayers);
        setTeams(fetchedTeams);
        setMatches(fetchedMatches);
        
        if (fetchedMatches.length > 0) {
          const firstMatchId = fetchedMatches[0].id;
          setSelectedMatchId(firstMatchId);
          loadMatchLineups(firstMatchId, fetchedMatches, fetchedTeams, fetchedPlayers);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (matchStarted && (period === '1T' || period === '2T')) {
      timerRef.current = setInterval(() => {
        setMatchTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [matchStarted, period]);

  const loadMatchLineups = (matchId: string, matchData: Match[], teamData: Team[], players: Player[]) => {
    try {
      const match = matchData.find(m => m.id === matchId);
      if (!match) {
        setPitchPlayers([]);
        return;
      }

      const localTeam = teamData.find(t => t.name === match.equipoLocal);
      const visitorTeam = teamData.find(t => t.name === match.equipoVisitante);

      let combined: PitchPlayer[] = [];

      
      if (localTeam) {
        const savedLocal = localStorage.getItem(`lineup_${localTeam.id}`);
        if (savedLocal) {
          const parsedLocal = JSON.parse(savedLocal);
          const restoredLocal = parsedLocal.map((p: any) => {
            
            let player = players.find(ap => ap.id === p.playerId);
            if (!player && p.playerId.startsWith('rival_')) {
              player = {
                id: p.playerId,
                firstNames: 'Rival',
                lastNames: '',
                teamId: 'rival',
                jerseyNumber: 'X' as any,
              } as Player;
            }
            return { x: p.x, y: p.y, player };
          }).filter((p: any) => p.player);
          combined = [...combined, ...restoredLocal];
        }
      }

      
      if (visitorTeam) {
        const savedVisitor = localStorage.getItem(`lineup_${visitorTeam.id}`);
        if (savedVisitor) {
          const parsedVisitor = JSON.parse(savedVisitor);
          const restoredVisitor = parsedVisitor.map((p: any) => {
            let player = players.find(ap => ap.id === p.playerId);
            if (!player && p.playerId.startsWith('rival_')) {
              player = {
                id: p.playerId,
                firstNames: 'Rival',
                lastNames: '',
                teamId: 'rival',
                jerseyNumber: 'X' as any,
              } as Player;
            }
            return { 
              x: 100 - p.x, 
              y: 100 - p.y, 
              player 
            };
          }).filter((p: any) => p.player);
          combined = [...combined, ...restoredVisitor];
        }
      }

      setPitchPlayers(combined);
    } catch (e) {
      console.error(e);
      setPitchPlayers([]);
    }
  };

  const handleMatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mId = e.target.value;
    setSelectedMatchId(mId);
    loadMatchLineups(mId, matches, teams, allPlayers);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getMatchMinute = () => {
    return Math.floor(matchTime / 60);
  };

  const handleStartPeriod = () => {
    if (period === 'Previo') {
      setPeriod('1T');
      setMatchTime(0);
      setStoppageTime(0);
    } else if (period === 'ET') {
      setPeriod('2T');
      setMatchTime(45 * 60); 
      setStoppageTime(0);
    }
    setMatchStarted(true);
  };

  const handleEndPeriod = () => {
    if (period === '1T') {
      setPeriod('ET'); 
      setMatchStarted(false);
    } else if (period === '2T') {
      setPeriod('Final');
      setMatchStarted(false);
    }
  };

  const addStoppageTime = (mins: number) => {
    setStoppageTime(prev => prev + mins);
    toast.success(`Se añadieron ${mins} minutos de reposición.`);
  };

  const handleRegisterEvent = (type: string) => {
    if (!matchStarted) {
      toast.error('El partido no está en curso.');
      return;
    }
    if (!selectedPlayerForEvent) {
      toast.error('Selecciona un jugador en la pizarra primero.');
      return;
    }

    const newEvent: MatchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      player: selectedPlayerForEvent,
      minute: getMatchMinute(),
      period
    };

    setEvents(prev => [newEvent, ...prev]);
    setSelectedPlayerForEvent(null);
    toast.success(`${type} registrado para ${selectedPlayerForEvent.firstNames}`);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Gol': return '⚽';
      case 'Asistencia': return '👟';
      case 'T. Amarilla': return '🟨';
      case 'T. Roja': return '🟥';
      case 'Sustitución': return '🔄';
      default: return '📍';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tracker en Vivo</h2>
          <p className="text-sm text-muted-foreground">Monitorea el desarrollo del encuentro en tiempo real.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select 
            className="px-3 py-2 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-ring"
            value={selectedMatchId}
            onChange={handleMatchChange}
            disabled={isLoading || period !== 'Previo'}
          >
            {matches.length === 0 ? <option value="">Sin partidos programados...</option> : null}
            {matches.map(m => (
              <option key={m.id} value={m.id}>{m.equipoLocal} vs {m.equipoVisitante}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        {}
        <Card className="md:col-span-12 lg:col-span-12 bg-zinc-900 text-white border-zinc-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-950 px-6 py-3 rounded-lg border border-zinc-800 flex items-center gap-4 shadow-inner">
                  <Clock className="h-6 w-6 text-zinc-400" />
                  <span className="text-4xl font-mono tracking-wider font-bold">
                    {formatTime(matchTime)}
                  </span>
                  <div className="flex flex-col items-start justify-center ml-2 border-l border-zinc-800 pl-4">
                    <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">{period === 'Previo' ? 'Sin Iniciar' : period === 'ET' ? 'Medio Tiempo' : period}</span>
                    {stoppageTime > 0 && <span className="text-sm font-bold text-green-400">+{stoppageTime}'</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(period === 'Previo' || period === 'ET') && (
                  <Button onClick={handleStartPeriod} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6">
                    <Play className="mr-2 h-4 w-4" /> 
                    {period === 'Previo' ? 'Iniciar 1er Tiempo' : 'Iniciar 2do Tiempo'}
                  </Button>
                )}
                
                {(period === '1T' || period === '2T') && matchStarted && (
                  <>
                    <Button variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white" onClick={() => addStoppageTime(1)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> +1 Min
                    </Button>
                    <Button variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white" onClick={() => addStoppageTime(3)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> +3 Min
                    </Button>
                    <Button onClick={handleEndPeriod} className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold">
                      <Square className="mr-2 h-4 w-4" /> 
                      {period === '1T' ? 'Pitar Medio Tiempo' : 'Pitar Final'}
                    </Button>
                  </>
                )}

                {period === 'Final' && (
                  <div className="px-4 py-2 bg-zinc-800 rounded text-sm font-semibold text-zinc-300">Partido Finalizado</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="md:col-span-8 lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" /> Pizarra Táctica (Selecciona un jugador)
            </CardTitle>
            <CardDescription>
              Toca un jugador en la cancha para asignarle un evento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pitchPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <AlertCircle className="h-8 w-8 mb-4 opacity-50" />
                <p>No hay una alineación guardada para este equipo.</p>
                <p className="text-sm mt-1">Dirígete a 'Alineaciones' para armar tu pizarra.</p>
              </div>
            ) : (
              <div className="relative w-full max-w-2xl mx-auto aspect-[16/10] bg-green-700 rounded-lg overflow-hidden border-2 border-white/20 shadow-inner flex items-center justify-center">
                <div className="absolute inset-4 border-2 border-white/30 rounded-sm pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 h-full bg-white/30 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full pointer-events-none"></div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-24 h-48 border-2 border-l-0 border-white/30 pointer-events-none"></div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-48 border-2 border-r-0 border-white/30 pointer-events-none"></div>

                {pitchPlayers.map(({ player, x, y }) => {
                  const isSelected = selectedPlayerForEvent?.id === player.id;
                  const isRival = player.teamId === 'rival';
                  return (
                    <div
                      key={player.id}
                      className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer transition-transform ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => setSelectedPlayerForEvent(isSelected ? null : player)}
                    >
                      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 shadow-lg ${
                        isSelected 
                          ? 'bg-yellow-400 text-yellow-900 border-white shadow-yellow-400/50' 
                          : isRival 
                            ? 'bg-red-600 text-white border-white/80' 
                            : 'bg-primary text-primary-foreground border-white/80'
                      }`}>
                        {player.jerseyNumber || '-'}
                      </div>
                      <div className={`mt-1 text-[10px] md:text-xs px-2 py-0.5 rounded shadow-sm whitespace-nowrap text-center max-w-[80px] truncate ${
                        isSelected 
                          ? 'bg-yellow-400 text-yellow-900 font-bold' 
                          : isRival 
                            ? 'bg-red-900/80 text-white' 
                            : 'bg-black/60 text-white'
                      }`}>
                        {player.firstNames.split(' ')[0]} {player.lastNames.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Registrar Evento</CardTitle>
              {selectedPlayerForEvent ? (
                <CardDescription className="text-yellow-600 dark:text-yellow-500 font-medium">
                  Jugador: {selectedPlayerForEvent.firstNames} {selectedPlayerForEvent.lastNames}
                </CardDescription>
              ) : (
                <CardDescription>Selecciona un jugador en la pizarra.</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className={`h-14 flex flex-col items-center justify-center gap-1 ${selectedPlayerForEvent ? 'hover:bg-blue-50 border-blue-200' : 'opacity-50 grayscale'}`}
                  onClick={() => handleRegisterEvent('Gol')}
                >
                  <span className="text-xl">⚽</span> Gol
                </Button>
                <Button 
                  variant="outline" 
                  className={`h-14 flex flex-col items-center justify-center gap-1 ${selectedPlayerForEvent ? 'hover:bg-blue-50 border-blue-200' : 'opacity-50 grayscale'}`}
                  onClick={() => handleRegisterEvent('Asistencia')}
                >
                  <span className="text-xl">👟</span> Asistencia
                </Button>
                <Button 
                  variant="outline" 
                  className={`h-14 flex flex-col items-center justify-center gap-1 ${selectedPlayerForEvent ? 'hover:bg-yellow-50 border-yellow-400' : 'opacity-50 grayscale'}`}
                  onClick={() => handleRegisterEvent('T. Amarilla')}
                >
                  <span className="text-xl">🟨</span> Amarilla
                </Button>
                <Button 
                  variant="outline" 
                  className={`h-14 flex flex-col items-center justify-center gap-1 ${selectedPlayerForEvent ? 'hover:bg-red-50 border-red-400' : 'opacity-50 grayscale'}`}
                  onClick={() => handleRegisterEvent('T. Roja')}
                >
                  <span className="text-xl">🟥</span> Roja
                </Button>
                <Button 
                  variant="outline" 
                  className={`h-14 flex flex-col items-center justify-center gap-1 col-span-2 ${selectedPlayerForEvent ? 'hover:bg-gray-100 border-gray-300' : 'opacity-50 grayscale'}`}
                  onClick={() => handleRegisterEvent('Sustitución')}
                >
                  <span className="text-xl">🔄</span> Sustitución
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Línea de Tiempo</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[300px]">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p className="text-sm">No hay eventos aún.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map(event => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg border bg-card text-sm">
                      <div className="font-bold text-muted-foreground w-8 text-right">
                        {event.minute}'
                      </div>
                      <div className="text-lg">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 truncate">
                        <span className="font-semibold">{event.player.firstNames.split(' ')[0]} {event.player.lastNames.split(' ')[0]}</span>
                        <span className="text-muted-foreground ml-1">({event.type})</span>
                      </div>
                      <div className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                        {event.period}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
