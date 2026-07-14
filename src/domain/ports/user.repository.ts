import type { UserProfile } from '../entities/user-profile.entity';
import type { UpdateProfileDto } from '../../application/dtos/update-profile.dto';

export interface UserRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(dto: UpdateProfileDto): Promise<UserProfile>;
  uploadAvatar(file: File): Promise<{ avatarUrl: string }>;
}
