import type { Team } from '../../domain/entities/team.entity';
import type { TeamRepository } from '../../domain/ports/team.repository';
import type { CreateTeamDto } from '../dtos/create-team.dto';
import type { UpdateTeamDto } from '../dtos/update-team.dto';

export class TeamUseCase {
  private readonly teamRepository: TeamRepository;

  constructor(teamRepository: TeamRepository) {
    this.teamRepository = teamRepository;
  }

  async getTeams(): Promise<Team[]> {
    return await this.teamRepository.getTeams();
  }

  async getTeamById(id: string): Promise<Team> {
    if (!id) throw new Error('El ID del equipo es requerido.');
    return await this.teamRepository.getTeamById(id);
  }

  async createTeam(dto: CreateTeamDto): Promise<Team> {
    if (dto.name.trim().length < 3) {
      throw new Error('El nombre del equipo debe tener al menos 3 caracteres.');
    }
    return await this.teamRepository.createTeam(dto);
  }

  async updateTeam(id: string, dto: UpdateTeamDto): Promise<Team> {
    if (!id) throw new Error('El ID del equipo es requerido.');
    return await this.teamRepository.updateTeam(id, dto);
  }

  async deleteTeam(id: string): Promise<void> {
    if (!id) throw new Error('El ID del equipo es requerido.');
    await this.teamRepository.deleteTeam(id);
  }

  async uploadBadge(id: string, file: File): Promise<{ badgeUrl: string }> {
    if (!file) throw new Error('Debe seleccionar una imagen.');
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('El escudo excede el tamaño máximo permitido de 2MB.');
    }
    return await this.teamRepository.uploadBadge(id, file);
  }
}