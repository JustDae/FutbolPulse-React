import type { TournamentRepository } from '../../domain/ports/tournament.repository';
import type { Tournament } from '../../domain/entities/tournament.entity';
import { TournamentMapper } from '../mappers/tournament.mapper';
import { axiosClient } from '../http/axios-client';

export class AxiosTournamentRepository implements TournamentRepository {
  private readonly baseUrl = '/torneos/';

  private normalizeListResponse<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
      return data as T[];
    }

    if (!data || typeof data !== 'object') {
      return [];
    }

    const payload = data as { results?: unknown; data?: unknown; torneos?: unknown };
    const list = Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.torneos)
          ? payload.torneos
          : [];

    return list as T[];
  }

  async getTournaments(): Promise<Tournament[]> {
    const { data } = await axiosClient.get(this.baseUrl);
    const list = this.normalizeListResponse<unknown>(data);
    return list.map(TournamentMapper.fromJsonToDomain);
  }

  async getTournamentById(id: string): Promise<Tournament> {
    const { data } = await axiosClient.get(`${this.baseUrl}${id}/`);
    return TournamentMapper.fromJsonToDomain(data);
  }

  async createTournament(dto: any): Promise<Tournament> {
    const payload = TournamentMapper.toBackendJson(dto);
    const { data } = await axiosClient.post(this.baseUrl, payload);
    return TournamentMapper.fromJsonToDomain(data);
  }

  async updateTournament(id: string, dto: any): Promise<Tournament> {
    const payload = TournamentMapper.toBackendJson(dto);
    const { data } = await axiosClient.patch(`${this.baseUrl}${id}/`, payload);
    return TournamentMapper.fromJsonToDomain(data);
  }

  async deleteTournament(id: string): Promise<void> {
    await axiosClient.delete(`${this.baseUrl}${id}/`);
  }
}
