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

  /** Migrate any badge stored only in localStorage → backend (fire-and-forget) */
  private syncLocalBadgesToBackend(teams: Team[]): void {
    teams.forEach(team => {
      const localBadge = localStorage.getItem(`mock_team_badge_${team.id}`);
      // Only sync if backend has no logo and we have a local copy
      if (localBadge && !team.badgeUrl) {
        axiosClient
          .patch(`${this.baseUrl}${team.id}/`, { logo_url: localBadge })
          .then(() => { team.badgeUrl = localBadge; })
          .catch(() => { /* non-critical */ });
      }
    });
  }

  async getTeams(): Promise<Team[]> {
    const { data } = await axiosClient.get(`${this.baseUrl}?page_size=100`);
    const list = this.normalizeListResponse<unknown>(data);
    const teams = list.map(raw => {
      const team = TeamMapper.fromJsonToDomain(raw);
      const localBadge = localStorage.getItem(`mock_team_badge_${team.id}`);
      // Prefer backend URL; fall back to local if backend has none
      if (!team.badgeUrl && localBadge) team.badgeUrl = localBadge;
      return team;
    });
    // Fire-and-forget: migrate local-only badges to backend
    this.syncLocalBadgesToBackend(teams);
    return teams;
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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        // Always save locally as fast cache
        try { localStorage.setItem(`mock_team_badge_${id}`, base64); } catch { /* quota exceeded — skip */ }

        // Persist to backend so all browsers can see the badge
        try {
          await axiosClient.patch(`${this.baseUrl}${id}/`, { logo_url: base64 });
        } catch (err) {
          console.warn('[uploadBadge] Could not persist badge to backend, stored locally only:', err);
        }

        resolve({ badgeUrl: base64 });
      };
      reader.onerror = () => reject(new Error('Error leyendo el archivo'));
      reader.readAsDataURL(file);
    });
  }

}