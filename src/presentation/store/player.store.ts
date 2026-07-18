import { create } from 'zustand';
import type { Player } from '../../domain/entities/player.entity';
import type { CreatePlayerDto } from '../../application/dtos/create-player.dto';
import type { UpdatePlayerDto } from '../../application/dtos/update-player.dto';
import { AxiosPlayerRepository } from '../../infrastructure/adapters/axios-player.repository';
interface PlayerState {
  players: Player[];
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
  fetchPlayers: () => Promise<void>;
  fetchCurrentPlayerByUserName: (name: string) => Promise<Player | null>;
  createPlayer: (dto: CreatePlayerDto) => Promise<Player>;
  updatePlayer: (id: string, dto: UpdatePlayerDto) => Promise<Player>;
  deletePlayer: (id: string) => Promise<void>;
  uploadPlayerPhoto: (id: string, file: File) => Promise<void>;
}
const playerRepo = new AxiosPlayerRepository();
export const usePlayerStore = create<PlayerState>((set, get) => ({
  players: [],
  currentPlayer: null,
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
  fetchCurrentPlayerByUserName: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      let currentPlayers = get().players;
      if (currentPlayers.length === 0) {
        currentPlayers = await playerRepo.getPlayers();
        set({ players: currentPlayers });
      }
      
      const searchName = name.toLowerCase().trim();
      let found = currentPlayers.find(p => {
        const fullName = `${p.firstNames} ${p.lastNames}`.toLowerCase();
        const reverseName = `${p.lastNames} ${p.firstNames}`.toLowerCase();
        return fullName.includes(searchName) || 
               reverseName.includes(searchName) || 
               (searchName.includes(p.firstNames.toLowerCase()) && searchName.includes(p.lastNames.toLowerCase()));
      });
      
      // Fallback: Si no hay coincidencia exacta, usar el primer jugador de la lista
      if (!found && currentPlayers.length > 0) {
        found = currentPlayers[0];
      }
      
      set({ currentPlayer: found || null, isLoading: false });
      return found || null;
    } catch (err: any) {
      set({ error: err.message || 'Error al buscar el perfil del jugador', isLoading: false });
      return null;
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
        const newPlayers = state.players.map((p) => (p.id === id ? { ...updated, photoUrl: preservedPhoto } : p));
        const newCurrentPlayer = state.currentPlayer?.id === id ? { ...updated, photoUrl: preservedPhoto } : state.currentPlayer;
        return {
          players: newPlayers,
          currentPlayer: newCurrentPlayer,
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
        currentPlayer: state.currentPlayer?.id === id ? null : state.currentPlayer
      }));
    } catch (err: any) {
      console.error('Error eliminando jugador:', err);
      throw err;
    }
  },
  uploadPlayerPhoto: async (id, file) => {
    try {
      const { photoUrl } = await playerRepo.uploadPhoto(id, file);
      set((state) => {
        const newPlayers = state.players.map((p) => (p.id === id ? { ...p, photoUrl } : p));
        const newCurrentPlayer = state.currentPlayer?.id === id ? { ...state.currentPlayer, photoUrl } : state.currentPlayer;
        return {
          players: newPlayers,
          currentPlayer: newCurrentPlayer
        };
      });
    } catch (err: any) {
      console.error('Error al subir foto:', err);
      throw err;
    }
  },
}));