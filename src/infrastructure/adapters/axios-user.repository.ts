import { axiosClient } from '../http/axios-client';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';

export class AxiosUserRepository {
  async getUsers(): Promise<LoggedUser[]> {
    const { data } = await axiosClient.get<any>('/users/');
    return data.results ? data.results : data;
  }

  async getUserById(id: string): Promise<LoggedUser> {
    const { data } = await axiosClient.get<LoggedUser>(`/users/${id}/`);
    return data;
  }

  async updateUser(id: string, userData: Partial<LoggedUser>): Promise<LoggedUser> {
    const { data } = await axiosClient.patch<LoggedUser>(`/users/${id}/`, userData);
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    await axiosClient.delete(`/users/${id}/`);
  }
}

export const userRepository = new AxiosUserRepository();
