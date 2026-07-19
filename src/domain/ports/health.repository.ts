import type { HealthBackground, Anthropometric, Injury, RehabSession, PerformanceTest, DietPlan } from '../entities/health.entity';

export interface HealthRepository {
  getHealthBackground(playerId: string): Promise<HealthBackground[]>;
  createHealthBackground(data: Omit<HealthBackground, 'id' | 'actualizadoEn'>): Promise<HealthBackground>;

  getAnthropometrics(playerId: string): Promise<Anthropometric[]>;
  createAnthropometric(data: Omit<Anthropometric, 'id' | 'imc'>): Promise<Anthropometric>;

  getInjuries(playerId: string): Promise<Injury[]>;
  createInjury(data: Omit<Injury, 'id'>): Promise<Injury>;

  getRehabSessions(injuryId: string): Promise<RehabSession[]>;
  createRehabSession(data: Omit<RehabSession, 'id'>): Promise<RehabSession>;

  getPerformanceTests(playerId: string): Promise<PerformanceTest[]>;
  createPerformanceTest(data: Omit<PerformanceTest, 'id'>): Promise<PerformanceTest>;

  getDietPlans(playerId: string): Promise<DietPlan[]>;
  createDietPlan(data: Omit<DietPlan, 'id'>): Promise<DietPlan>;
}
