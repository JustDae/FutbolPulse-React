import type { Tournament } from '../../domain/entities/tournament.entity';

export class TournamentMapper {
  static fromJsonToDomain(raw: any): Tournament {
    return {
      id: raw.id || raw._id || raw.id_torneo || '',
      name: raw.nombre || raw.name || 'Torneo sin nombre',
      entidadId: raw.entidad || '',
      nombreEntidad: raw.nombre_entidad || '',
      minAge: raw.edad_minima ?? null,
      maxAge: raw.edad_maxima ?? null,
      gender: raw.genero || 'Masculino',
      isActive: raw.activo ?? raw.isActive ?? true,
    };
  }

  static toBackendJson(dto: any): any {
    return {
      nombre: dto.name,
      entidad: dto.entidadId,
      edad_minima: dto.minAge || null,
      edad_maxima: dto.maxAge || null,
      genero: dto.gender || 'Masculino',
      activo: dto.isActive ?? true,
    };
  }
}
