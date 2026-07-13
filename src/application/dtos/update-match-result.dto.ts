import type { MatchStatus } from '../../domain/entities/match.entity';

export interface UpdateMatchResultDto {
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
}