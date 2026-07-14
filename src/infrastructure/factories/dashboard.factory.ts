import { AxiosPlayerRepository } from '@/infrastructure/adapters/axios-player.repository';
import { AxiosTeamRepository } from '@/infrastructure/adapters/axios-team.repository';
import { AxiosTournamentRepository } from '@/infrastructure/adapters/axios-tournament.repository';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import { DashboardUseCase } from '@/application/use-cases/dashboard.use-case';
import { AxiosHealthRepository } from '@/infrastructure/adapters/axios-health.repository';

export const healthRepository = new AxiosHealthRepository();

export const dashboardUseCase = new DashboardUseCase(
  new AxiosTeamRepository(),
  new AxiosPlayerRepository(),
  matchRepository,
  new AxiosTournamentRepository(),
);
