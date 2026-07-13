import type { Match, MatchStatus } from '../../domain/entities/match.entity';

export class MatchMapper {
  static fromJsonToDomain(raw: any): Match {
    return {
      id: raw.id || raw._id || raw.id_partido || '',
      tournamentId: raw.categoria || raw.tournamentId || raw.torneo_id || raw.id_torneo || '',
      equipoLocal: raw.equipo_local || 'Local',
      equipoVisitante: raw.equipo_visitante || 'Visitante',
      matchType: raw.tipo_partido || 'Liga',
      homeScore: raw.goles_favor ?? raw.homeScore ?? raw.goles_local ?? null,
      awayScore: raw.goles_contra ?? raw.awayScore ?? raw.goles_visitante ?? null,
      matchDate: raw.fecha || raw.matchDate || raw.fecha_partido || new Date().toISOString(),
      stadium: raw.stadium || raw.estadio || 'Estadio por definir',
      status: (raw.estado_partido || raw.status || raw.estado || 'Programado') as MatchStatus,
    };
  }

  static toBackendJson(dto: any): any {
    return {
      categoria: dto.tournamentId,
      equipo_local: dto.equipoLocal,
      equipo_visitante: dto.equipoVisitante,
      tipo_partido: dto.matchType,
      goles_favor: dto.homeScore,
      goles_contra: dto.awayScore,
      fecha: dto.matchDate,
      estadio: dto.stadium,
      estado_partido: dto.status,
    };
  }
}