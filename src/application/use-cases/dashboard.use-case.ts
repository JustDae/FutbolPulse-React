import type { TeamRepository } from '../../domain/ports/team.repository';
import type { PlayerRepository } from '../../domain/ports/player.repository';
import type { MatchRepository } from '../../domain/ports/match.repository';
import type { TournamentRepository } from '../../domain/ports/tournament.repository';
import type { AdminStats } from '../../domain/entities/admin-stats.entity';
import type { Team } from '../../domain/entities/team.entity';
import type { Match } from '../../domain/entities/match.entity';
import type { Tournament } from '../../domain/entities/tournament.entity';

export class DashboardUseCase {
  private readonly teamRepository: TeamRepository;
  private readonly playerRepository: PlayerRepository;
  private readonly matchRepository: MatchRepository;
  private readonly tournamentRepository: TournamentRepository;

  constructor(
    teamRepository: TeamRepository,
    playerRepository: PlayerRepository,
    matchRepository: MatchRepository,
    tournamentRepository: TournamentRepository
  ) {
    this.teamRepository = teamRepository;
    this.playerRepository = playerRepository;
    this.matchRepository = matchRepository;
    this.tournamentRepository = tournamentRepository;
  }

  private normalizeCollection<T>(value: unknown): T[] {
    if (Array.isArray(value)) {
      return value as T[];
    }

    if (!value || typeof value !== 'object') {
      return [];
    }

    const payload = value as { results?: unknown; data?: unknown };
    const list = Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.data)
        ? payload.data
        : [];

    return list as T[];
  }

  async getAdminStats(): Promise<AdminStats> {
    const [teamsResponse, playersResponse, matchesResponse, tournamentsResponse] = await Promise.all([
      this.teamRepository.getTeams(),
      this.playerRepository.getPlayers(),
      this.matchRepository.getMatches(),
      this.tournamentRepository.getTournaments(),
    ]);

    const teams = this.normalizeCollection<Team>(teamsResponse);
    const players = this.normalizeCollection(playersResponse);
    const matches = this.normalizeCollection<Match>(matchesResponse);
    const tournaments = this.normalizeCollection<Tournament>(tournamentsResponse);

    const activeTeams = teams.filter((t) => t.isActive).length;
    const pendingMatches = matches.filter((m) => m.status === 'Programado').length;
    const activeTournaments = tournaments.filter((t) => t.isActive).length;

    return {
      totalTeams: teams.length,
      activeTeams,
      totalPlayers: players.length,
      totalMatches: matches.length,
      pendingMatches,
      activeTournaments,
    };
  }
}