import type { MatchStatus } from '../../domain/entities/match.entity';

export interface CreateMatchDto {
  tournamentId: string;
  equipoLocal: string;
  equipoVisitante: string;
  matchType: string;
  matchDate: string;
  stadium?: string;
  status?: MatchStatus; 
}