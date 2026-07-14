import type { TeamModel } from '@/domain/models/team.model';

export class TeamFactory {
  static createDefault(): TeamModel {
    return {
      id: '',
      name: '',
      logoUrl: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
