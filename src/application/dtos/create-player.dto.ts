export interface CreatePlayerDto {
  firstNames: string;
  lastNames: string;
  birthDate: string;
  jerseyNumber: number;
  teamId: string;
  isActive?: boolean;
}
