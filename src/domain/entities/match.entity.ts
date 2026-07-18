export type MatchStatus = 'Programado' | 'En curso' | 'Finalizado' | 'Suspendido' | 'Aplazado';

export interface MatchStats {
  shots: { home: number; away: number };
  kickToGoal: { home: number; away: number };
  possession: { home: number; away: number };
  violations: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
  corners: { home: number; away: number };
}

export interface PlayerNode {
  id: string;
  number: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  x: number;
  y: number;
}

export interface Lineup {
  formation: string;
  players: PlayerNode[];
}

export interface Standing {
  teamId: string;
  teamName: string;
  flagUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

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

  liveMinute?: number;
  stats?: MatchStats;
  homeLineup?: Lineup;
  awayLineup?: Lineup;
}
