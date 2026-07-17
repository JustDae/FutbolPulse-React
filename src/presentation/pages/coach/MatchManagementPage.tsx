import { useState, useEffect } from 'react';
import { Plus, Calendar, Loader2, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import { AxiosTournamentRepository } from '@/infrastructure/adapters/axios-tournament.repository';
import type { Match } from '@/domain/entities/match.entity';
import type { Tournament } from '@/domain/entities/tournament.entity';

const tournamentRepo = new AxiosTournamentRepository();

export function MatchManagementPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [equipoLocal, setEquipoLocal] = useState('');
  const [equipoVisitante, setEquipoVisitante] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchType, setMatchType] = useState('Liga');
  const [tournamentId, setTournamentId] = useState('');
  const [stadium, setStadium] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedMatches, fetchedTournaments] = await Promise.all([
        matchRepository.getMatches(),
        tournamentRepo.getTournaments()
      ]);
      setMatches(fetchedMatches);
      setTournaments(fetchedTournaments);
      if (fetchedTournaments.length > 0) {
        setTournamentId(fetchedTournaments[0].id);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId) {
      alert('Debes seleccionar un torneo/categoría');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await matchRepository.createMatch({
        tournamentId,
        equipoLocal,
        equipoVisitante,
        matchDate: new Date(matchDate).toISOString(),
        matchType,
        stadium,
        status: 'Programado'
      });
      setIsDialogOpen(false);
      setEquipoLocal('');
      setEquipoVisitante('');
      setMatchDate('');
      setStadium('');
      fetchData();
    } catch (error) {
      console.error('Error creating match', error);
      alert('Hubo un error al crear el partido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Clean SaaS Header */}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Gestión de Partidos</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Planifica y administra los próximos encuentros del equipo.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl bg-[#f94116] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e03a13] shadow-md">
              <Plus className="h-4 w-4" /> Nuevo Partido
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programar Nuevo Partido</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del próximo encuentro.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateMatch} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría / Torneo</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={tournamentId} 
                  onChange={e => setTournamentId(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona una categoría...</option>
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Equipo Local</label>
                  <input 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ej: Mi Equipo" 
                    value={equipoLocal}
                    onChange={e => setEquipoLocal(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Equipo Visitante</label>
                  <input 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ej: Rival FC" 
                    value={equipoVisitante}
                    onChange={e => setEquipoVisitante(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha y Hora</label>
                  <input 
                    type="datetime-local" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={matchDate}
                    onChange={e => setMatchDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={matchType}
                    onChange={e => setMatchType(e.target.value)}
                    required
                  >
                    <option value="Liga">Liga</option>
                    <option value="Copa">Copa</option>
                    <option value="Amistoso">Amistoso</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sede / Estadio</label>
                <input 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Lugar del encuentro" 
                  value={stadium}
                  onChange={e => setStadium(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="button" variant="outline" className="mr-2" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting || !tournamentId}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Guardar Partido
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-[#101010] border border-gray-200 dark:border-[#1a1a1c] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-[#1a1a1c] flex items-center justify-between bg-gray-50/50 dark:bg-[#151515]">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Próximos Encuentros</h3>
            <p className="text-sm text-gray-500 dark:text-[#888888] mt-1">Planifica y gestiona los partidos de tu equipo.</p>
          </div>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-[#888888]" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-[#888888] border-2 border-dashed border-gray-200 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-transparent">
              <Calendar className="mx-auto h-12 w-12 mb-4 text-gray-300 dark:text-zinc-600" />
              <p className="font-medium text-gray-600 dark:text-zinc-400">No hay partidos programados.</p>
              <p className="text-sm mt-1">Utiliza el botón "Nuevo Partido" para programar uno.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(match => (
                <div key={match.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-200 dark:border-white/5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-gray-100 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-zinc-500 font-bold text-sm tracking-widest">VS</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{match.equipoLocal} vs {match.equipoVisitante}</h4>
                      <div className="flex items-center flex-wrap text-sm text-gray-500 dark:text-[#888888] gap-4 mt-2">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(match.matchDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(match.matchDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {match.stadium && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {match.stadium}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 text-gray-600 dark:text-[#888888] text-xs rounded-full font-medium shadow-sm">
                      {match.matchType}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm border ${match.status === 'Programado' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' : 'bg-gray-100 dark:bg-[#1a1a1c] text-gray-600 dark:text-[#888888] border-gray-200 dark:border-white/5'}`}>
                      {match.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
