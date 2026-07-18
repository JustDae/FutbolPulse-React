import { create } from 'zustand';
import type { Player } from '../../domain/entities/player.entity';
import type { CreatePlayerDto } from '../../application/dtos/create-player.dto';
import type { UpdatePlayerDto } from '../../application/dtos/update-player.dto';
import { AxiosPlayerRepository } from '../../infrastructure/adapters/axios-player.repository';
interface PlayerState {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  fetchPlayers: () => Promise<void>;
  createPlayer: (dto: CreatePlayerDto) => Promise<Player>;
  updatePlayer: (id: string, dto: UpdatePlayerDto) => Promise<Player>;
  deletePlayer: (id: string) => Promise<void>;
  uploadPlayerPhoto: (id: string, file: File) => Promise<void>;
}
const playerRepo = new AxiosPlayerRepository();
export const usePlayerStore = create<PlayerState>((set) => ({
  players: [],
  isLoading: false,
  error: null,
  fetchPlayers: async () => {
    set({ isLoading: true, error: null });
    try {
      const players = await playerRepo.getPlayers();
      set({ players, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error cargando jugadores', isLoading: false });
    }
  },
  createPlayer: async (dto) => {
    set({ isLoading: true });
    try {
      const newPlayer = await playerRepo.createPlayer(dto);
      set((state) => ({ players: [...state.players, newPlayer], isLoading: false }));
      return newPlayer;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },
  updatePlayer: async (id, dto) => {
    set({ isLoading: true });
    try {
      const updated = await playerRepo.updatePlayer(id, dto);
      set((state) => {
        const existingPlayer = state.players.find(p => p.id === id);
        const preservedPhoto = existingPlayer?.photoUrl || updated.photoUrl;
        return {
          players: state.players.map((p) => (p.id === id ? { ...updated, photoUrl: preservedPhoto } : p)),
          isLoading: false,
        };
      });
      return updated;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },
  deletePlayer: async (id) => {
    try {
      await playerRepo.deletePlayer(id);
      set((state) => ({
        players: state.players.filter((p) => p.id !== id),
      }));
    } catch (err: any) {
      console.error('Error eliminando jugador:', err);
      throw err;
    }
  },
  uploadPlayerPhoto: async (id, file) => {
    try {
      const { photoUrl } = await playerRepo.uploadPhoto(id, file);
      set((state) => ({
        players: state.players.map((p) => (p.id === id ? { ...p, photoUrl } : p)),
      }));
    } catch (err: any) {
      console.error('Error al subir foto:', err);
      throw err;
    }
  },
}));