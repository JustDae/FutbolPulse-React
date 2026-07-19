import { create } from 'zustand';

import type { UserProfile } from '@/domain/entities/user-profile.entity';
import type { UpdateProfileDto } from '@/application/dtos/update-profile.dto';
import { AxiosUserRepository } from '@/infrastructure/adapters/axios-user.repository';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (dto: UpdateProfileDto) => Promise<UserProfile>;
  uploadAvatar: (file: File) => Promise<void>;
}

const userRepository = new AxiosUserRepository();

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userRepository.getProfile();
      set({ profile, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'No se pudo cargar el perfil',
        isLoading: false,
      });
    }
  },

  updateProfile: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userRepository.updateProfile(dto);
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'No se pudo actualizar el perfil',
        isLoading: false,
      });
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const { avatarUrl } = await userRepository.uploadAvatar(file);
      set((state) => ({
        profile: state.profile ? { ...state.profile, avatarUrl } : state.profile,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'No se pudo actualizar la foto',
        isLoading: false,
      });
      throw error;
    }
  },
}));
