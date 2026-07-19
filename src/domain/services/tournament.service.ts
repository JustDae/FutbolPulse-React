export interface TournamentService {
  startTournament(id: string): Promise<void>;
  finishTournament(id: string): Promise<void>;
  generateMatchSchedule(id: string): Promise<void>;
}
