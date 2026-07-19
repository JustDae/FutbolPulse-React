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
      position: raw.position || raw.posicion || undefined,
      teamId: raw.teamId || raw.equipo_id || raw.id_equipo || raw.entidad || '',
      teamName: raw.nombre_entidad || '',
      categoryName: raw.nombre_categoria || '',
      photoUrl: raw.photoUrl || raw.foto || raw.imagen_url || raw.foto_url || '',
      isActive: raw.isActive ?? raw.activo ?? raw.estado === 'Activo',
      pieDominante: raw.pie_dominante || '',
      nacionalidad: raw.nacionalidad || '',
    };
  }

  static toBackendJson(dto: any): any {
    return {
      entidad: dto.teamId,
      nombres: dto.firstNames,
      apellidos: dto.lastNames,
      fecha_nacimiento: dto.birthDate,
      numero_camiseta: dto.jerseyNumber,
      posicion: dto.position,
      estado: dto.isActive === false ? 'Inactivo' : 'Activo',
      pie_dominante: dto.pieDominante,
      nacionalidad: dto.nacionalidad,
    };
  }
}
