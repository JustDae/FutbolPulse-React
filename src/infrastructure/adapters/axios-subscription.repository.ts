import { axiosClient } from '../http/axios-client';
import type { Subscription, CreateSubscriptionDto } from '@/domain/entities/subscription.entity';

export class AxiosSubscriptionRepository {
  async getSubscriptions(): Promise<Subscription[]> {
    const { data } = await axiosClient.get<any>('/suscripciones/');
    return data.results ? data.results : data;
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
    const { data } = await axiosClient.get<Subscription>(`/suscripciones/${id}/`);
    return data;
  }

  async getActiveSubscription(): Promise<Subscription | null> {
    try {
      const { data } = await axiosClient.get<Subscription>('/suscripciones/activa/');
      return data;
    } catch (error) {
      return null;
    }
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { data } = await axiosClient.post<Subscription>('/suscripciones/', dto);
    return data;
  }

  async updateSubscription(id: string, subData: Partial<Subscription>): Promise<Subscription> {
    const { data } = await axiosClient.patch<Subscription>(`/suscripciones/${id}/`, subData);
    return data;
  }

  async deleteSubscription(id: string): Promise<void> {
    await axiosClient.delete(`/suscripciones/${id}/`);
  }
}

export const subscriptionRepository = new AxiosSubscriptionRepository();
