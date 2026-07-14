export interface CreateTeamDto {
  name: string;
  coach: string;
  stadium?: string;
  foundedYear: number;
  isActive?: boolean;
  userId?: string;
}