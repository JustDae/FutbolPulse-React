export interface TeamStats {
  teamId: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  form: ('W' | 'D' | 'L')[];
}
