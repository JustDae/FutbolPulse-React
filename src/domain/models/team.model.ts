export interface TeamModel {
  id: string;
  name: string;
  logoUrl?: string;
  coachId?: string;
  foundedYear?: number;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}
