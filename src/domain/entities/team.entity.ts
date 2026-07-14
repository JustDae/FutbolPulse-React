export interface Team {
  id: string;
  name: string;
  coach: string;
  stadium?: string;
  foundedYear: number;
  badgeUrl?: string; 
  isActive: boolean;
  createdAt?: string;
}