import type { Match } from '../entities/match.entity';
import type { CreateMatchDto } from '../../application/dtos/create-match.dto';
import type { UpdateMatchResultDto } from '../../application/dtos/update-match-result.dto';

export interface MatchRepository {
  getMatches(): Promise<Match[]>;
  getMatchById(id: string): Promise<Match>;
  createMatch(dto: CreateMatchDto): Promise<Match>;
  updateResult(id: string, dto: UpdateMatchResultDto): Promise<Match>;
  deleteMatch(id: string): Promise<void>;
}
