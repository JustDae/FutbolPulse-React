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

      liveMinute: (raw.estado_partido || raw.status || raw.estado) === 'En curso' 
        ? (raw.liveMinute ?? Math.floor(Math.random() * 45) + 45) 
        : undefined,
      stats: (() => {
        const homeG = raw.goles_favor ?? raw.homeScore ?? raw.goles_local ?? 0;
        const awayG = raw.goles_contra ?? raw.awayScore ?? raw.goles_visitante ?? 0;
        const seed = String(raw.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) || 7;
        const sHome = homeG * 4 + (seed % 6) + 6;
        const sAway = awayG * 3 + (seed % 5) + 4;
        const onTargetH = homeG + (seed % 3) + 1;
        const onTargetA = awayG + (seed % 2) + 1;
        const possH = 45 + (seed % 12);
        return {
          shots: { home: sHome, away: sAway },
          kickToGoal: { home: Math.min(onTargetH, sHome), away: Math.min(onTargetA, sAway) },
          possession: { home: possH, away: 100 - possH },
          violations: { home: 8 + (seed % 7), away: 9 + (seed % 8) },
          yellowCards: { home: seed % 3, away: (seed + 1) % 3 },
          redCards: { home: seed % 23 === 0 ? 1 : 0, away: seed % 29 === 0 ? 1 : 0 },
          offsides: { home: seed % 4, away: (seed + 2) % 4 },
          corners: { home: 3 + (seed % 6), away: 2 + (seed % 5) },
        };
      })(),
      homeLineup: {
        formation: '4-3-3',
        players: [
          { id: '1', number: 1, name: 'Costa', position: 'GK', x: 50, y: 5 },
          { id: '2', number: 20, name: 'Cancelo', position: 'DEF', x: 85, y: 20 },
          { id: '3', number: 3, name: 'Pepe', position: 'DEF', x: 65, y: 15 },
          { id: '4', number: 4, name: 'Dias', position: 'DEF', x: 35, y: 15 },
          { id: '5', number: 19, name: 'Mendes', position: 'DEF', x: 15, y: 20 },
          { id: '6', number: 8, name: 'Bruno', position: 'MID', x: 75, y: 45 },
          { id: '7', number: 10, name: 'Bernardo', position: 'MID', x: 50, y: 40 },
          { id: '8', number: 6, name: 'Palhinha', position: 'MID', x: 25, y: 45 },
          { id: '9', number: 7, name: 'Ronaldo', position: 'FWD', x: 50, y: 85 },
          { id: '10', number: 11, name: 'Felix', position: 'FWD', x: 20, y: 75 },
          { id: '11', number: 17, name: 'Leao', position: 'FWD', x: 80, y: 75 },
        ]
      }
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