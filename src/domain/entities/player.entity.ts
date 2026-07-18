export interface Player {
  id: string;
  name: string;
  firstNames: string;
  lastNames: string;
  birthDate: string;
  jerseyNumber: number;
  position?: 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
  teamId: string;
  teamName?: string;
  categoryName?: string;
  photoUrl?: string;
  isActive: boolean;
  pieDominante?: string;
  nacionalidad?: string;
}
