import type { UserModel } from '@/domain/models/user.model';

export class UserMapper {
  static fromDtoToModel(dto: any): UserModel {
    return {
      id: dto.id || '',
      username: dto.username || '',
      email: dto.email || '',
      tipo_usuario: dto.tipo_usuario || 'Player',
      createdAt: dto.created_at || new Date().toISOString(),
    };
  }
}
