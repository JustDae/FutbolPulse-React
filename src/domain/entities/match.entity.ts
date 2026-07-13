export type MatchStatus = 'Programado' | 'En curso' | 'Finalizado' | 'Suspendido' | 'Aplazado';

export interface Match {
  id: string;
  tournamentId: string;
  equipoLocal: string;
  equipoVisitante: string;
  matchType: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate: string;
  stadium?: string;
  status: MatchStatus;
}
