import { useState, useEffect } from 'react';
import { ClipboardList, Save, UserCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import type { Match } from '@/domain/entities/match.entity';
import type { Player } from '@/domain/entities/player.entity';
import type { Team } from '@/domain/entities/team.entity';
import { useAuthStore } from '@/presentation/store/auth.store';
import { toast } from 'sonner';
import { matchesCoach } from '@/presentation/utils/name.utils';

const playerRepo = new AxiosPlayerRepository();
const teamRepo = new AxiosTeamRepository();

export function PostMatchEvaluationPage() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [coachTeams, setCoachTeams] = useState<Team[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedMatches, fetchedPlayers, fetchedTeams] = await Promise.all([
          matchRepository.getMatches(),
          playerRepo.getPlayers(),
          teamRepo.getTeams()
        ]);

        let myTeams = fetchedTeams;
        const isAdmin = user?.tipo_usuario?.toLowerCase() === 'admin' || user?.is_staff;

        if (!isAdmin && user?.nombre_completo) {
          myTeams = fetchedTeams.filter(t => 
            matchesCoach(t.coach, user.nombre_completo)
          );
        }

        setCoachTeams(myTeams);

        let myMatches = fetchedMatches.filter(m => m.status === 'Finalizado' || m.status === 'Programado' || m.status === 'En curso');

        if (!isAdmin && myTeams.length > 0) {
          const myTeamNames = myTeams.map(t => t.name);
          myMatches = myMatches.filter(m => 
            myTeamNames.includes(m.equipoLocal) || myTeamNames.includes(m.equipoVisitante)
          );
        }

        setMatches(myMatches);
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleMatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matchId = e.target.value;
    setSelectedMatchId(matchId);

    if (matchId) {
      const match = matches.find(m => m.id === matchId);
      if (!match) return;

      let relevantTeamIds = coachTeams.map(t => t.id);

      if (relevantTeamIds.length === 0) {
        const localTeam = coachTeams.find(t => t.name === match.equipoLocal);
        const awayTeam = coachTeams.find(t => t.name === match.equipoVisitante);
        if (localTeam) relevantTeamIds.push(localTeam.id);
        if (awayTeam) relevantTeamIds.push(awayTeam.id);
      }

      const filteredPlayers = players.filter(p => relevantTeamIds.includes(p.teamId));

      setEvaluations(filteredPlayers.map(p => ({
        playerId: p.id,
        player: p,
        rating: 0,
        comment: '',
        isVisible: false
      })));
    } else {
      setEvaluations([]);
    }
  };

  const updateEvaluation = (playerId: string, field: string, value: any) => {
    setEvaluations(prev => prev.map(e => 
      e.playerId === playerId ? { ...e, [field]: value } : e
    ));
  };

  const handleSave = () => {
    toast.success('Evaluaciones guardadas exitosamente');
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Evaluaciones Post-Partido</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Califica y provee retroalimentación sobre el rendimiento.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="px-4 py-2 bg-white dark:bg-[#101010] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none text-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#f94116]/50"
            value={selectedMatchId}
            onChange={handleMatchChange}
            disabled={isLoading}
          >
            <option value="">Seleccionar partido...</option>
            {matches.map(m => (
              <option key={m.id} value={m.id} className="bg-white dark:bg-[#101010] text-gray-900 dark:text-white">
                {m.equipoLocal} vs {m.equipoVisitante}
              </option>
            ))}
          </select>

          <button onClick={handleSave} disabled={evaluations.length === 0} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition shadow-sm ${evaluations.length === 0 ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed' : 'bg-[#f94116] text-white hover:bg-[#e03a13]'}`}>
            <Save className="h-4 w-4" /> Guardar Todo
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ClipboardList className="h-5 w-5 text-[#f94116]" /> Calificar Jugadores
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-[#888888]">
            Evalúa el rendimiento de los jugadores. Puedes marcar si el feedback es visible para ellos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-[#888888]" />
            </div>
          ) : !selectedMatchId || evaluations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-[#888888] border-2 border-dashed border-gray-200 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-transparent">
              <UserCheck className="mx-auto h-12 w-12 mb-4 text-gray-300 dark:text-zinc-600" />
              <p className="text-lg font-medium text-gray-600 dark:text-zinc-400">Selecciona un partido para evaluar</p>
              <p className="text-sm mt-1">Busca el partido en la parte superior para cargar los jugadores.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {evaluations.map(ev => (
                <div key={ev.playerId} className="p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-white/5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{ev.player.firstNames} {ev.player.lastNames}</h4>
                    <p className="text-xs text-gray-500 dark:text-[#888888] mt-1">{ev.player.position}</p>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap flex-1 justify-end">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-600 dark:text-[#888888]">Calificación (1-10):</label>
                      <input 
                        type="number" 
                        min="1" max="10" 
                        value={ev.rating || ''}
                        onChange={(e) => updateEvaluation(ev.playerId, 'rating', Number(e.target.value))}
                        className="w-16 h-8 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#101010] px-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-[#f94116]"
                      />
                    </div>

                    <input 
                      type="text" 
                      placeholder="Comentario sobre el rendimiento..." 
                      value={ev.comment}
                      onChange={(e) => updateEvaluation(ev.playerId, 'comment', e.target.value)}
                      className="w-full md:w-[250px] h-8 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#101010] px-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-[#f94116]"
                    />

                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-[#888888] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={ev.isVisible}
                        onChange={(e) => updateEvaluation(ev.playerId, 'isVisible', e.target.checked)}
                        className="rounded border-gray-300 text-[#f94116] focus:ring-[#f94116]"
                      />
                      Visible para el jugador
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
