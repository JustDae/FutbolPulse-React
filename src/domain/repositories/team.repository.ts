import type { TeamModel } from '../models/team.model';
import type { PaginatedResult } from '../entities/paginated-result.entity';
import type { TeamStats } from '../entities/team-stats.entity';

export interface TeamRepository {
  getTeams(page: number, limit: number): Promise<PaginatedResult<TeamModel>>;
  getTeamById(id: string): Promise<TeamModel>;
  getTeamStats(id: string): Promise<TeamStats>;
  createTeam(team: Partial<TeamModel>): Promise<TeamModel>;
  updateTeam(id: string, team: Partial<TeamModel>): Promise<TeamModel>;
  deleteTeam(id: string): Promise<void>;
}
