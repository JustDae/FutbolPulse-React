import type { Player } from '../entities/player.entity';
import type { CreatePlayerDto } from '../../application/dtos/create-player.dto';
import type { UpdatePlayerDto } from '../../application/dtos/update-player.dto';
export interface PlayerRepository {
  getPlayers(): Promise<Player[]>;
  getPlayersByTeam(teamId: string): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player>;
  createPlayer(dto: CreatePlayerDto): Promise<Player>;
  updatePlayer(id: string, dto: UpdatePlayerDto): Promise<Player>;
  deletePlayer(id: string): Promise<void>;
  uploadPhoto(id: string, file: File): Promise<{ photoUrl: string }>;
}
