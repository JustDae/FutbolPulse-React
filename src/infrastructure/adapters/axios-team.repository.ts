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
    const { data } = await axiosClient.get(this.baseUrl);
    const list = this.normalizeListResponse<unknown>(data);
    return list.map(TeamMapper.fromJsonToDomain);
  }

  async getTeamById(id: string): Promise<Team> {
    const { data } = await axiosClient.get(`${this.baseUrl}${id}/`);
    return TeamMapper.fromJsonToDomain(data);
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
    const formData = new FormData();
    formData.append('escudo', file);

    const { data } = await axiosClient.patch(`${this.baseUrl}${id}/escudo/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { badgeUrl: data.badgeUrl || data.url || data.escudo };
  }
}