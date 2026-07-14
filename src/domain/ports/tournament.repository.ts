import type { Tournament } from '../entities/tournament.entity';

export interface TournamentRepository {
  getTournaments(): Promise<Tournament[]>;
  getTournamentById(id: string): Promise<Tournament>;
  createTournament(dto: any): Promise<Tournament>;
  updateTournament(id: string, dto: any): Promise<Tournament>;
  deleteTournament(id: string): Promise<void>;
}
