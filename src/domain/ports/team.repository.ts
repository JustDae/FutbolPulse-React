import type { Team } from '../entities/team.entity';
import type { CreateTeamDto } from '../../application/dtos/create-team.dto';
import type { UpdateTeamDto } from '../../application/dtos/update-team.dto';

export interface TeamRepository {
  getTeams(): Promise<Team[]>;
  getTeamById(id: string): Promise<Team>;
  createTeam(dto: CreateTeamDto): Promise<Team>;
  updateTeam(id: string, dto: UpdateTeamDto): Promise<Team>;
  deleteTeam(id: string): Promise<void>;
  uploadBadge(id: string, file: File): Promise<{ badgeUrl: string }>;
}