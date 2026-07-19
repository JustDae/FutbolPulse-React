import { axiosClient } from '@/infrastructure/http/axios-client';
import { parseApiError } from '@/infrastructure/http/parse-api-error';
import type { Match } from '@/domain/entities/match.entity';
import { MatchMapper } from '../mappers/match.mapper';

const normalizeListResponse = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (!data || typeof data !== 'object') {
    return [];
  }

  const payload = data as { results?: unknown; data?: unknown; matches?: unknown };
  const list = Array.isArray(payload.results)
    ? payload.results
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.matches)
        ? payload.matches
        : [];

  return list as T[];
};

export interface CreateMatchDTO {
  tournamentId: string;
  equipoLocal: string;
  equipoVisitante: string;
  matchType: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate: string;
  stadium?: string;
  status?: 'Programado' | 'En curso' | 'Finalizado' | 'Suspendido' | 'Aplazado';
}

export interface UpdateMatchDTO {
  tournamentId?: string;
  equipoLocal?: string;
  equipoVisitante?: string;
  matchType?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate?: string;
  stadium?: string;
  status?: 'Programado' | 'En curso' | 'Finalizado' | 'Suspendido' | 'Aplazado';
}

export const matchRepository = {
  getMatches: async (): Promise<Match[]> => {
    try {
      const { data } = await axiosClient.get<unknown>('/matches/?page_size=100');
      const rawMatches = normalizeListResponse<any>(data);
      return rawMatches.map(MatchMapper.fromJsonToDomain);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  getAll: async (): Promise<Match[]> => {
    return matchRepository.getMatches();
  },

  getMatchById: async (id: string): Promise<Match> => {
    try {
      const { data } = await axiosClient.get<any>(`/matches/${id}/`);
      return MatchMapper.fromJsonToDomain(data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  getById: async (id: string): Promise<Match> => {
    return matchRepository.getMatchById(id);
  },

  createMatch: async (data: CreateMatchDTO): Promise<Match> => {
    try {
      const backendPayload = MatchMapper.toBackendJson(data);
      const { data: match } = await axiosClient.post<any>('/matches/', backendPayload);
      return MatchMapper.fromJsonToDomain(match);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  create: async (data: CreateMatchDTO): Promise<Match> => {
    return matchRepository.createMatch(data);
  },

  updateResult: async (id: string, data: UpdateMatchDTO): Promise<Match> => {
    try {
      const backendPayload = MatchMapper.toBackendJson(data);
      const { data: match } = await axiosClient.patch<any>(`/matches/${id}/`, backendPayload);
      return MatchMapper.fromJsonToDomain(match);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  update: async (id: string, data: UpdateMatchDTO): Promise<Match> => {
    return matchRepository.updateResult(id, data);
  },

  deleteMatch: async (id: string): Promise<void> => {
    try {
      await axiosClient.delete(`/matches/${id}/`);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    return matchRepository.deleteMatch(id);
  },
};
