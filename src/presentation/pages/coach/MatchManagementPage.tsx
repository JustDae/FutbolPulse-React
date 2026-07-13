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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Partidos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Partido
            </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>Próximos Encuentros</CardTitle>
          <CardDescription>Planifica y gestiona los partidos de tu equipo.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
              <p>No hay partidos programados.</p>
              <p className="text-sm">Utiliza el botón "Nuevo Partido" para programar uno.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(match => (
                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">VS</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{match.equipoLocal} vs {match.equipoVisitante}</h4>
                      <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(match.matchDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(match.matchDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {match.stadium && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {match.stadium}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-col md:flex-row">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
                      {match.matchType}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${match.status === 'Programado' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {match.status}
                    </span>
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
