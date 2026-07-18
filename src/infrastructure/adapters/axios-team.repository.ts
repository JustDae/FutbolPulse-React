import type { TeamRepository } from '../../domain/ports/team.repository';
import type { Team } from '../../domain/entities/team.entity';
import type { CreateTeamDto } from '../../application/dtos/create-team.dto';
import type { UpdateTeamDto } from '../../application/dtos/update-team.dto';
import { TeamMapper } from '../mappers/team.mapper';
import { axiosClient } from '../http/axios-client';

export class AxiosTeamRepository implements TeamRepository {
  private readonly baseUrl = '/equipos/';

  private normalizeListResponse<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
      return data as T[];
    }

    if (!data || typeof data !== 'object') {
      return [];
    }

    const payload = data as { results?: unknown; data?: unknown; equipos?: unknown };
    const list = Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.equipos)
          ? payload.equipos
          : [];

    return list as T[];
  }

  async getTeams(): Promise<Team[]> {
    const { data } = await axiosClient.get(`${this.baseUrl}?page_size=100`);
    const list = this.normalizeListResponse<unknown>(data);
    return list.map(raw => {
      const team = TeamMapper.fromJsonToDomain(raw);
      const mockBadge = localStorage.getItem(`mock_team_badge_${team.id}`);
      if (mockBadge) team.badgeUrl = mockBadge;
      return team;
    });
  }

  async getTeamById(id: string): Promise<Team> {
    const { data } = await axiosClient.get(`${this.baseUrl}${id}/`);
    const team = TeamMapper.fromJsonToDomain(data);
    const mockBadge = localStorage.getItem(`mock_team_badge_${team.id}`);
    if (mockBadge) team.badgeUrl = mockBadge;
    return team;
  }

  async createTeam(dto: CreateTeamDto): Promise<Team> {
    const payload = TeamMapper.toBackendJson(dto);
    const { data } = await axiosClient.post(this.baseUrl, payload);
    return TeamMapper.fromJsonToDomain(data);
  }

  async updateTeam(id: string, dto: UpdateTeamDto): Promise<Team> {
    const payload = TeamMapper.toBackendJson(dto);
    const { data } = await axiosClient.patch(`${this.baseUrl}${id}/`, payload);
    return TeamMapper.fromJsonToDomain(data);
  }

  async deleteTeam(id: string): Promise<void> {
    await axiosClient.delete(`${this.baseUrl}${id}/`);
  }

  async uploadBadge(id: string, file: File): Promise<{ badgeUrl: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        localStorage.setItem(`mock_team_badge_${id}`, base64);
        resolve({ badgeUrl: base64 });
      };
      reader.readAsDataURL(file);
    });
  }
}