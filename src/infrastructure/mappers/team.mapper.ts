import type { Team } from '../../domain/entities/team.entity';

export class TeamMapper {
  static fromJsonToDomain(raw: any): Team {
    return {
      id: raw.id || raw._id || raw.id_equipo || '',
      name: raw.name || raw.nombre_entidad || raw.nombre || raw.nombre_equipo || 'Equipo sin nombre',
      coach: raw.coach || raw.entrenador || raw.director_tecnico || 'Sin DT',
      stadium: raw.stadium || raw.ciudad || raw.estadio || 'Estadio no asignado',
      foundedYear: Number(raw.foundedYear || raw.anio_fundacion || raw.fundacion || 0),
      badgeUrl: raw.badgeUrl || raw.logo_url || raw.escudo || raw.imagen_url || raw.logo || '',
      isActive: raw.isActive ?? (raw.estado ? raw.estado === 'Activo' : raw.activo ?? true),
      createdAt: raw.createdAt || raw.creado_en || raw.fecha_creacion,
    };
  }

  static toBackendJson(dto: any): any {
    const payload: any = {
      usuario: dto.userId ?? null,
      nombre_entidad: dto.name,
      director_tecnico: dto.coach ?? '',
      anio_fundacion: dto.foundedYear ?? null,
      ciudad: dto.stadium ?? '',
      pais: 'Ecuador',
      telefono_contacto: '',
      estado: dto.isActive === false ? 'Inactivo' : 'Activo',
    };

    if (dto.badgeUrl !== undefined) {
      payload.logo_url = dto.badgeUrl;
    }

    return payload;
  }
}