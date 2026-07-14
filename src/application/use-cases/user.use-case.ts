import type { UserRepository } from '../../domain/ports/user.repository';
import type { UserProfile } from '../../domain/entities/user-profile.entity';
import type { UpdateProfileDto } from '../dtos/update-profile.dto';

export class UserUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getProfile(): Promise<UserProfile> {
    return await this.userRepository.getProfile();
  }

  async updateProfile(dto: UpdateProfileDto): Promise<UserProfile> {
    return await this.userRepository.updateProfile(dto);
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    if (!file) throw new Error('Debe seleccionar una imagen de perfil.');
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('La imagen de perfil excede el límite de 2MB.');
    }
    return await this.userRepository.uploadAvatar(file);
  }
}