export interface CreateTournamentDto {
  name: string;
  season: string;
  startDate: string; 
  endDate: string;  
  isActive?: boolean;
}