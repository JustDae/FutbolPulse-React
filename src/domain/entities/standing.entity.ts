export interface Standing {
  teamId: string;
  teamName: string;
  teamLogo?: string;
  tournamentId?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
