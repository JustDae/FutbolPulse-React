import type { Player } from '../../domain/entities/player.entity';
import type { PlayerRepository } from '../../domain/ports/player.repository';
import type { CreatePlayerDto } from '../dtos/create-player.dto';
import type { UpdatePlayerDto } from '../dtos/update-player.dto';

export class PlayerUseCase {
  private readonly playerRepository: PlayerRepository;

  constructor(playerRepository: PlayerRepository) {
    this.playerRepository = playerRepository;
  }

  async getPlayers(): Promise<Player[]> {
    return await this.playerRepository.getPlayers();
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    if (!teamId) throw new Error('El ID del equipo es requerido.');
    return await this.playerRepository.getPlayersByTeam(teamId);
  }

  async getPlayerById(id: string): Promise<Player> {
    if (!id) throw new Error('El ID del jugador es requerido.');
    return await this.playerRepository.getPlayerById(id);
  }

  async createPlayer(dto: CreatePlayerDto): Promise<Player> {
    if (dto.jerseyNumber < 1 || dto.jerseyNumber > 99) {
      throw new Error('El dorsal del jugador debe estar entre el 1 y el 99.');
    }
    if (!dto.teamId) {
      throw new Error('El jugador debe estar asignado a un equipo.');
    }
    return await this.playerRepository.createPlayer(dto);
  }

  async updatePlayer(id: string, dto: UpdatePlayerDto): Promise<Player> {
    if (!id) throw new Error('El ID del jugador es requerido.');
    return await this.playerRepository.updatePlayer(id, dto);
  }

  async deletePlayer(id: string): Promise<void> {
    if (!id) throw new Error('El ID del jugador es requerido.');
    await this.playerRepository.deletePlayer(id);
  }

  async uploadPhoto(id: string, file: File): Promise<{ photoUrl: string }> {
    if (!file) throw new Error('Debe seleccionar una foto.');
    return await this.playerRepository.uploadPhoto(id, file);
  }
}