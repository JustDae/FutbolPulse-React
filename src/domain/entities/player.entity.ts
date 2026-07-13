export interface Player {
  id: string;
  name: string;
  firstNames: string;
  lastNames: string;
  birthDate: string;
  jerseyNumber: number;
  position?: 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
  teamId: string;
  photoUrl?: string;
  isActive: boolean;
}
