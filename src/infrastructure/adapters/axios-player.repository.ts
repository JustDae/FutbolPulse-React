import type { PlayerRepository } from '../../domain/ports/player.repository';
import type { Player } from '../../domain/entities/player.entity';
import type { CreatePlayerDto } from '../../application/dtos/create-player.dto';
import type { UpdatePlayerDto } from '../../application/dtos/update-player.dto';
import { PlayerMapper } from '../mappers/player.mapper';
import { axiosClient } from '../http/axios-client';

export class AxiosPlayerRepository implements PlayerRepository {
  private readonly baseUrl = '/jugadores/';

  private normalizeListResponse<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
      return data as T[];
    }

    if (!data || typeof data !== 'object') {
      return [];
    }

    const payload = data as { results?: unknown; data?: unknown; jugadores?: unknown };
    const list = Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.jugadores)
          ? payload.jugadores
          : [];

    return list as T[];
  }

  async getPlayers(): Promise<Player[]> {
    const { data } = await axiosClient.get(this.baseUrl);
    const list = this.normalizeListResponse<unknown>(data);
    return list.map(PlayerMapper.fromJsonToDomain);
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    const { data } = await axiosClient.get(`/equipos/${teamId}/jugadores/`);
    const list = Array.isArray(data) ? data : data.jugadores || data.data || [];
    return list.map(PlayerMapper.fromJsonToDomain);
  }

  async getPlayerById(id: string): Promise<Player> {
    const { data } = await axiosClient.get(`${this.baseUrl}${id}/`);
    return PlayerMapper.fromJsonToDomain(data);
  }

  async createPlayer(dto: CreatePlayerDto): Promise<Player> {
    const payload = PlayerMapper.toBackendJson(dto);
    const { data } = await axiosClient.post(this.baseUrl, payload);
    return PlayerMapper.fromJsonToDomain(data);
  }

  async updatePlayer(id: string, dto: UpdatePlayerDto): Promise<Player> {
    const payload = PlayerMapper.toBackendJson(dto);
    const { data } = await axiosClient.patch(`${this.baseUrl}${id}/`, payload);
    return PlayerMapper.fromJsonToDomain(data);
  }

  async deletePlayer(id: string): Promise<void> {
    await axiosClient.delete(`${this.baseUrl}${id}/`);
  }

  async uploadPhoto(id: string, file: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('foto', file);

    const { data } = await axiosClient.patch(`${this.baseUrl}${id}/foto/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { photoUrl: data.photoUrl || data.url || data.foto };
  }
}