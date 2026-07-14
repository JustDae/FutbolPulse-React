import type { Tournament } from '../../domain/entities/tournament.entity';
import type { TournamentRepository } from '../../domain/ports/tournament.repository';
import type { CreateTournamentDto } from '../dtos/create-tournament.dto';
import type { UpdateTournamentDto } from '../dtos/update-tournament.dto';

export class TournamentUseCase {
  private readonly tournamentRepository: TournamentRepository;

  constructor(tournamentRepository: TournamentRepository) {
    this.tournamentRepository = tournamentRepository;
  }

  async getTournaments(): Promise<Tournament[]> {
    return await this.tournamentRepository.getTournaments();
  }

  async getTournamentById(id: string): Promise<Tournament> {
    if (!id) throw new Error('El ID del torneo es requerido.');
    return await this.tournamentRepository.getTournamentById(id);
  }

  async createTournament(dto: CreateTournamentDto): Promise<Tournament> {
    if (new Date(dto.startDate) > new Date(dto.endDate)) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de finalización.');
    }
    return await this.tournamentRepository.createTournament(dto);
  }

  async updateTournament(id: string, dto: UpdateTournamentDto): Promise<Tournament> {
    if (!id) throw new Error('El ID del torneo es requerido.');
    return await this.tournamentRepository.updateTournament(id, dto);
  }

  async deleteTournament(id: string): Promise<void> {
    if (!id) throw new Error('El ID del torneo es requerido.');
    await this.tournamentRepository.deleteTournament(id);
  }
}