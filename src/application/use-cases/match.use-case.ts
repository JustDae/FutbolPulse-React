import type { Match } from '../../domain/entities/match.entity';
import type { MatchRepository } from '../../domain/ports/match.repository';
import type { CreateMatchDto } from '../dtos/create-match.dto';
import type { UpdateMatchResultDto } from '../dtos/update-match-result.dto';

export class MatchUseCase {
  private readonly matchRepository: MatchRepository;

  constructor(matchRepository: MatchRepository) {
    this.matchRepository = matchRepository;
  }

  async getMatches(): Promise<Match[]> {
    return await this.matchRepository.getMatches();
  }

  async createMatch(dto: CreateMatchDto): Promise<Match> {
    if (!dto.tournamentId) {
      throw new Error('El ID del torneo es obligatorio');
    }
    return await this.matchRepository.createMatch(dto);
  }

  async updateResult(id: string, dto: UpdateMatchResultDto): Promise<Match> {
    if (!id) throw new Error('El ID del partido es requerido.');
    if (dto.homeScore < 0 || dto.awayScore < 0) {
      throw new Error('Los goles no pueden ser números negativos.');
    }
    return await this.matchRepository.updateResult(id, dto);
  }

  async deleteMatch(id: string): Promise<void> {
    if (!id) throw new Error('El ID del partido es requerido.');
    await this.matchRepository.deleteMatch(id);
  }
}