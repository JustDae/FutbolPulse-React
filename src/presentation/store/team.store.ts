import { create } from 'zustand';
import type { Team } from '../../domain/entities/team.entity';
import { AxiosTeamRepository } from '../../infrastructure/adapters/axios-team.repository';
import type { CreateTeamDto } from '../../application/dtos/create-team.dto';
import type { UpdateTeamDto } from '../../application/dtos/update-team.dto';
import { useAuthStore } from './auth.store';

interface TeamState {
  teams: Team[];
  isLoading: boolean;
  error: string | null;

  fetchTeams: () => Promise<void>;
  createTeam: (dto: CreateTeamDto) => Promise<Team>;
  updateTeam: (id: string, dto: UpdateTeamDto) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  uploadTeamBadge: (id: string, file: File) => Promise<void>;
}

const teamRepo = new AxiosTeamRepository();

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  isLoading: false,
  error: null,

  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const teams = await teamRepo.getTeams();
      set({ teams, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al cargar equipos', isLoading: false });
    }
  },

  createTeam: async (dto) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      const userId = user?.id || user?.user_id;
      const newTeam = await teamRepo.createTeam({ ...dto, userId });
      set((state) => ({ teams: [...state.teams, newTeam], isLoading: false }));
      return newTeam;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateTeam: async (id, dto) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      const userId = user?.id || user?.user_id;
      const updated = await teamRepo.updateTeam(id, { ...dto, userId });
      set((state) => {
        const existingTeam = state.teams.find(t => t.id === id);
        const preservedBadge = existingTeam?.badgeUrl || updated.badgeUrl;
        return {
          teams: state.teams.map((t) => (t.id === id ? { ...updated, badgeUrl: preservedBadge } : t)),
          isLoading: false,
        };
      });
      return updated;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  deleteTeam: async (id) => {
    try {
      await teamRepo.deleteTeam(id);
      set((state) => ({
        teams: state.teams.filter((t) => t.id !== id),
      }));
    } catch (err: any) {
      console.error('Error eliminando equipo:', err);
      throw err;
    }
  },

  uploadTeamBadge: async (id, file) => {
    try {
      const { badgeUrl } = await teamRepo.uploadBadge(id, file);
      set((state) => ({
        teams: state.teams.map((t) => (t.id === id ? { ...t, badgeUrl } : t)),
      }));
    } catch (err: any) {
      console.error('Error al subir el escudo:', err);
      throw err;
    }
  },
}));