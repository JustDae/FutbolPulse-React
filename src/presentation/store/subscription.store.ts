import { create } from 'zustand';
import { subscriptionRepository } from '@/infrastructure/adapters/axios-subscription.repository';
import { useAuthStore } from './auth.store';
import type { Subscription } from '@/domain/entities/subscription.entity';

interface SubscriptionState {
  activeSubscription: Subscription | null;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SubscriptionActions {
  checkPremiumStatus: () => Promise<void>;
  clearSubscription: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  activeSubscription: null,
  isPremium: false,
  isLoading: false,
  error: null,

  checkPremiumStatus: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ activeSubscription: null, isPremium: false, isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const subscription = await subscriptionRepository.getActiveSubscription();
      
      if (!subscription) {
        set({ activeSubscription: null, isPremium: false, isLoading: false });
        return;
      }

      const isPlanPremium = subscription.plan.toLowerCase() === 'premium';
      const isStatusActive = subscription.estado.toLowerCase() === 'activo';

      const isPremium = isPlanPremium && isStatusActive;

      set({
        activeSubscription: subscription,
        isPremium,
        isLoading: false,
      });
    } catch (error) {
      set({
        activeSubscription: null,
        isPremium: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al verificar suscripción',
      });
    }
  },

  clearSubscription: () => {
    set({ activeSubscription: null, isPremium: false, isLoading: false, error: null });
  },
}));
