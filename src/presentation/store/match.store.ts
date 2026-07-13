import { create } from 'zustand';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { CreateMatchDTO, UpdateMatchDTO } from '@/infrastructure/adapters/axios-match.repository';
import type { Match } from '@/domain/entities/match.entity';

interface MatchState {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  createMatch: (data: CreateMatchDTO) => Promise<void>;
  updateMatch: (id: string, data: UpdateMatchDTO) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  getMatchById: (id: string) => Match | undefined;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  isLoading: false,
  error: null,

  fetchMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const matches = await matchRepository.getAll();
      set({ matches, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar los partidos',
        isLoading: false 
      });
    }
  },

  createMatch: async (data: CreateMatchDTO) => {
    set({ isLoading: true, error: null });
    try {
      const newMatch = await matchRepository.create(data);
      set((state) => ({ 
        matches: [...state.matches, newMatch],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al crear el partido',
        isLoading: false 
      });
      throw error;
    }
  },

  updateMatch: async (id: string, data: UpdateMatchDTO) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMatch = await matchRepository.update(id, data);
      set((state) => ({
        matches: state.matches.map((match) => 
          match.id === id ? updatedMatch : match
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar el partido',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteMatch: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await matchRepository.delete(id);
      set((state) => ({
        matches: state.matches.filter((match) => match.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al eliminar el partido',
        isLoading: false 
      });
      throw error;
    }
  },

  getMatchById: (id: string) => {
    return get().matches.find((match) => match.id === id);
  },
}));
