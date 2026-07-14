import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { Match, MatchStatus } from '../../../domain/entities/match.entity';
import { useMatchStore } from '../../store/match.store';
import { useTournamentStore } from '../../store/tournament.store';
import { useTeamStore } from '../../store/team.store';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface MatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  matchToEdit?: Match | null;
}

export function MatchDialog({ isOpen, onClose, matchToEdit }: MatchDialogProps) {
  const { createMatch, updateMatch } = useMatchStore();
  const { tournaments, fetchTournaments } = useTournamentStore();
  const { teams, fetchTeams } = useTeamStore();

  const [tournamentId, setTournamentId] = useState('');
  const [localTeamInput, setLocalTeamInput] = useState('');
  const [awayTeamInput, setAwayTeamInput] = useState('');
  const [matchType, setMatchType] = useState('Liga');
  const [matchDate, setMatchDate] = useState('');
  const [homeScore, setHomeScore] = useState<number | undefined>(undefined);
  const [awayScore, setAwayScore] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<MatchStatus>('Programado');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, [fetchTournaments, fetchTeams]);

  useEffect(() => {
    if (matchToEdit) {
      setTournamentId(matchToEdit.tournamentId);
      setMatchType(matchToEdit.matchType);
      
      setLocalTeamInput(matchToEdit.equipoLocal);
      setAwayTeamInput(matchToEdit.equipoVisitante);

      try {
        const d = new Date(matchToEdit.matchDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dtString = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setMatchDate(dtString);
      } catch (e) {
        setMatchDate(matchToEdit.matchDate.split('T')[0]);
      }

      setHomeScore(matchToEdit.homeScore || undefined);
      setAwayScore(matchToEdit.awayScore || undefined);
      setStatus(matchToEdit.status);
    } else {
      resetForm();
    }
  }, [matchToEdit, isOpen, tournaments]);

  const resetForm = () => {
    setTournamentId('');
    setLocalTeamInput('');
    setAwayTeamInput('');
    setMatchType('Liga');
    setMatchDate('');
    setHomeScore(undefined);
    setAwayScore(undefined);
    setStatus('Programado');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!tournamentId || !localTeamInput || !awayTeamInput || !matchDate) {
        toast.error('Por favor completa todos los campos obligatorios');
        setIsSubmitting(false);
        return;
      }

      const matchData = {
        tournamentId,
        equipoLocal: localTeamInput,
        equipoVisitante: awayTeamInput,
        matchType,
        matchDate: new Date(matchDate).toISOString(),
        homeScore,
        awayScore,
        status,
      };

      if (matchToEdit) {
        await updateMatch(matchToEdit.id, matchData);
        toast.success('Partido actualizado correctamente');
      } else {
        await createMatch(matchData);
        toast.success('Partido creado correctamente');
      }

      resetForm();
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data 
        ? JSON.stringify(error.response.data)
        : 'Error al procesar el partido';
      toast.error(msg);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {matchToEdit ? 'Editar Partido' : 'Programar Nuevo Partido'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tournament">Torneo / Categoría</Label>
            <Select value={tournamentId} onValueChange={(val) => {
              setTournamentId(val);
              const userTeam = tournaments.find(t => t.id === val)?.nombreEntidad;
              if (userTeam && !localTeamInput && !awayTeamInput) {
                setLocalTeamInput(userTeam); 
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar torneo" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="localTeam">Equipo Local</Label>
              <Select value={localTeamInput} onValueChange={setLocalTeamInput}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo local" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayTeam">Equipo Visitante</Label>
              <Select value={awayTeamInput} onValueChange={setAwayTeamInput}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo visitante" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matchType">Tipo de Partido</Label>
            <Select value={matchType} onValueChange={setMatchType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de partido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Liga">Liga</SelectItem>
                <SelectItem value="Copa">Copa</SelectItem>
                <SelectItem value="Amistoso">Amistoso</SelectItem>
                <SelectItem value="Torneo">Torneo</SelectItem>
                <SelectItem value="Playoffs">Playoffs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matchDate">Fecha y Hora del Partido</Label>
            <Input
              id="matchDate"
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeScore">Goles a Favor</Label>
              <Input
                id="homeScore"
                type="number"
                min="0"
                value={homeScore ?? ''}
                onChange={(e) => setHomeScore(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayScore">Goles en Contra</Label>
              <Input
                id="awayScore"
                type="number"
                min="0"
                value={awayScore ?? ''}
                onChange={(e) => setAwayScore(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programado">Programado</SelectItem>
                <SelectItem value="En curso">En curso</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
                <SelectItem value="Aplazado">Aplazado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : matchToEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
