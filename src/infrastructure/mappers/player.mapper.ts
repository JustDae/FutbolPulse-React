import type { Player } from '../../domain/entities/player.entity';

export class PlayerMapper {
  static fromJsonToDomain(raw: any): Player {
    return {
      id: raw.id || raw._id || raw.id_jugador || '',
      name: raw.name || raw.nombre || [raw.nombres, raw.apellidos].filter(Boolean).join(' ') || 'Jugador sin nombre',
      firstNames: raw.nombres || '',
      lastNames: raw.apellidos || '',
      birthDate: raw.fecha_nacimiento || '',
      jerseyNumber: Number(raw.jerseyNumber ?? raw.dorsal ?? raw.numero ?? raw.numero_camiseta ?? 0),
      teamId: raw.teamId || raw.equipo_id || raw.id_equipo || raw.entidad || '',
      photoUrl: raw.photoUrl || raw.foto || raw.imagen_url || raw.foto_url || '',
      isActive: raw.isActive ?? raw.activo ?? raw.estado === 'Activo',
    };
  }

  static toBackendJson(dto: any): any {
    return {
      entidad: dto.teamId,
      nombres: dto.firstNames,
      apellidos: dto.lastNames,
      fecha_nacimiento: dto.birthDate,
      numero_camiseta: dto.jerseyNumber,
      estado: dto.isActive === false ? 'Inactivo' : 'Activo',
    };
  }
}
