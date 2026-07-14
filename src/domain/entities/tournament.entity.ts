export interface Tournament {
  id: string;
  name: string;
  entidadId: string;
  nombreEntidad?: string;
  minAge?: number | null;
  maxAge?: number | null;
  gender: string;
  isActive: boolean;
}
