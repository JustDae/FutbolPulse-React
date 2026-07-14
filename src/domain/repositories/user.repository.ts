import type { UserModel } from '../models/user.model';
import type { UserStats } from '../entities/user-stats.entity';
import type { PaginatedResult } from '../entities/paginated-result.entity';

export interface UserRepository {
  getUsers(page: number, limit: number): Promise<PaginatedResult<UserModel>>;
  getUserById(id: string): Promise<UserModel>;
  getUserStats(id: string): Promise<UserStats>;
  updateUser(id: string, data: Partial<UserModel>): Promise<UserModel>;
  deleteUser(id: string): Promise<void>;
}
