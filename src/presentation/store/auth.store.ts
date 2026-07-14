import { create } from 'zustand';
import { AxiosAuthRepository } from '@/infrastructure/adapters/axios-auth.repository';
import { AUTH_EXPIRED_EVENT } from '@/infrastructure/http/axios-client';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';

const authRepository = new AxiosAuthRepository();

interface AuthState {
  user: LoggedUser | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<LoggedUser>;
  register: (data: import('../../application/dtos/register.dto').RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (data: Partial<LoggedUser>) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_EXPIRED_EVENT, () => {
      authRepository.clearLocalSession();
      set({
        user: null,
        isLoading: false,
        error: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.',
        hasHydrated: true,
      });
    });
  }

  return {
    user: null,
    isLoading: false,
    error: null,
    hasHydrated: false,

  login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const session = await authRepository.login(email, password);
        set({ user: session.user, isLoading: false, hasHydrated: true });
        return session.user;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al iniciar sesión',
          isLoading: false,
        });
        throw error;
      }
    },

    register: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const session = await authRepository.register(data);
        set({ user: session.user, isLoading: false, hasHydrated: true });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al registrarse',
          isLoading: false,
        });
        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await authRepository.logout();
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al cerrar sesión',
          isLoading: false,
        });
        throw error;
      }

      authRepository.clearLocalSession();
      set({ user: null, isLoading: false, hasHydrated: true });
    },

    getCurrentUser: async () => {
      set({ isLoading: true, error: null });
      try {
        const user = await authRepository.getCurrentUser();
        set({ user, isLoading: false, hasHydrated: true });
      } catch (error) {
        authRepository.clearLocalSession();
        set({
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error al obtener el usuario',
          hasHydrated: true,
        });
      }
    },

    restoreSession: async () => {
      const tokens = authRepository.getStoredTokens();
      if (!tokens) {
        set({ user: null, isLoading: false, error: null, hasHydrated: true });
        return;
      }

      set({ isLoading: true, error: null });
      try {
        const user = await authRepository.getCurrentUser();
        set({ user, isLoading: false, error: null, hasHydrated: true });
      } catch (error) {
        authRepository.clearLocalSession();
        set({
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error al restaurar la sesión',
          hasHydrated: true,
        });
      }
    },

    updateUser: (data) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      }));
    },

    clearError: () => {
      set({ error: null });
    },
  };
});
