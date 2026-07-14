import type { Standing } from '../entities/standing.entity';

export interface StandingsService {
  getTournamentStandings(tournamentId: string): Promise<Standing[]>;
  getGroupStandings(tournamentId: string, groupId: string): Promise<Standing[]>;
}
