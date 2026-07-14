import { create } from 'zustand';
import type { Tournament } from '../../domain/entities/tournament.entity';
import { AxiosTournamentRepository } from '../../infrastructure/adapters/axios-tournament.repository';

interface TournamentState {
  tournaments: Tournament[];
  isLoading: boolean;
  fetchTournaments: () => Promise<void>;
  createTournament: (dto: any) => Promise<void>;
  updateTournament: (id: string, dto: any) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
}

const repo = new AxiosTournamentRepository();

export const useTournamentStore = create<TournamentState>((set, get) => ({
  tournaments: [],
  isLoading: false,

  fetchTournaments: async () => {
    set({ isLoading: true });
    try {
      const tournaments = await repo.getTournaments();
      set({ tournaments, isLoading: false });
    } catch (error) {
      console.error('Error cargando torneos', error);
      set({ isLoading: false });
    }
  },

  createTournament: async (dto) => {
    set({ isLoading: true });
    const newTournament = await repo.createTournament(dto);
    set({ tournaments: [...get().tournaments, newTournament], isLoading: false });
  },

  updateTournament: async (id, dto) => {
    set({ isLoading: true });
    const updated = await repo.updateTournament(id, dto);
    set({
      tournaments: get().tournaments.map((t) => (t.id === id ? updated : t)),
      isLoading: false,
    });
  },

  deleteTournament: async (id) => {
    await repo.deleteTournament(id);
    set({ tournaments: get().tournaments.filter((t) => t.id !== id) });
  },
}));
