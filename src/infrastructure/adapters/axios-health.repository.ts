import type { HealthRepository } from '../../domain/ports/health.repository';
import type { 
  HealthBackground, Anthropometric, Injury, 
  RehabSession, PerformanceTest, DietPlan 
} from '../../domain/entities/health.entity';
import { axiosClient } from '../http/axios-client';
import { parseApiError } from '../http/parse-api-error';

const normalizeResponse = (data: any) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(v => toCamelCase(v));
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(v => toSnakeCase(v));
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

export class AxiosHealthRepository implements HealthRepository {
  async getHealthBackground(playerId: string): Promise<HealthBackground[]> {
    try {
      const { data } = await axiosClient.get(`/salud/?jugador=${playerId}`);
      return toCamelCase(normalizeResponse(data));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async createHealthBackground(dto: any): Promise<HealthBackground> {
    try {
      const { data } = await axiosClient.post(`/salud/`, toSnakeCase(dto));
      return toCamelCase(data);
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async getAnthropometrics(playerId: string): Promise<Anthropometric[]> {
    try {
      const { data } = await axiosClient.get(`/antropometria/?jugador=${playerId}`);
      return toCamelCase(normalizeResponse(data));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async createAnthropometric(dto: any): Promise<Anthropometric> {
    try {
      const { data } = await axiosClient.post(`/antropometria/`, toSnakeCase(dto));
      return toCamelCase(data);
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async getInjuries(playerId: string): Promise<Injury[]> {
    try {
      const { data } = await axiosClient.get(`/lesiones/?jugador=${playerId}`);
      return toCamelCase(normalizeResponse(data));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async createInjury(dto: any): Promise<Injury> {
    try {
      const { data } = await axiosClient.post(`/lesiones/`, toSnakeCase(dto));
      return toCamelCase(data);
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async getRehabSessions(injuryId: string): Promise<RehabSession[]> {
    try {
      const { data } = await axiosClient.get(`/rehabilitacion/?lesion=${injuryId}`);
      return toCamelCase(normalizeResponse(data));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async createRehabSession(dto: any): Promise<RehabSession> {
    try {
      const { data } = await axiosClient.post(`/rehabilitacion/`, toSnakeCase(dto));
      return toCamelCase(data);
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async getPerformanceTests(playerId: string): Promise<PerformanceTest[]> {
    try {
      const { data } = await axiosClient.get(`/rendimiento/?jugador=${playerId}`);
      return toCamelCase(normalizeResponse(data));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async createPerformanceTest(dto: any): Promise<PerformanceTest> {
    try {
      const { data } = await axiosClient.post(`/rendimiento/`, toSnakeCase(dto));
      return toCamelCase(data);
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async getDietPlans(playerId: string): Promise<DietPlan[]> {
    try {
      const { data } = await axiosClient.get(`/dietas/?jugador=${playerId}`);
      return toCamelCase(normalizeResponse(data));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  async createDietPlan(dto: any): Promise<DietPlan> {
    try {
      const { data } = await axiosClient.post(`/dietas/`, toSnakeCase(dto));
      return toCamelCase(data);
    } catch (error) {
      throw parseApiError(error);
    }
  }
}
