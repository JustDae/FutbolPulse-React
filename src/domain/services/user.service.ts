import type { UserRepository } from '../repositories/user.repository';
import type { UserModel } from '../models/user.model';
import type { PaginatedResult } from '../entities/paginated-result.entity';

export class UserService {
  userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async listUsers(page = 1, limit = 10): Promise<PaginatedResult<UserModel>> {
    return this.userRepository.getUsers(page, limit);
  }

  async getProfile(userId: string): Promise<UserModel> {
    return this.userRepository.getUserById(userId);
  }
}
