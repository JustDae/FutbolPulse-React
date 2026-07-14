export interface HealthBackground {
  id: string;
  jugadorId: string;
  tipoSangre: string;
  alergias: string;
  medicamentosRegulares: string;
  condicionesCronicas: string;
  contactoMedicoNombre: string;
  contactoMedicoTel: string;
  actualizadoEn: string;
}

export interface Anthropometric {
  id: string;
  jugadorId: string;
  pesoKg: number;
  alturaCm: number;
  grasaCorporal: number;
  masaMuscular: number;
  imc: number;
  fechaToma: string;
  observaciones: string;
}

export interface Injury {
  id: string;
  jugadorId: string;
  descripcion: string;
  zonaCuerpo: string;
  tipoLesion: string;
  gravedad: 'Leve' | 'Moderada' | 'Grave';
  fechaInicio: string;
  fechaAlta: string | null;
  activa: boolean;
  medicoTratante: string;
  observaciones: string;
}

export interface RehabSession {
  id: string;
  lesionId: string;
  ejerciciosRealizados: string;
  duracionMinutos: number;
  dolorNivel: number;
  fechaSesion: string;
  fisioterapeuta: string;
  observaciones: string;
}

export interface PerformanceTest {
  id: string;
  jugadorId: string;
  velocidad30mSeg: number;
  velocidad60mSeg: number;
  saltoVerticalCm: number;
  saltoHorizontalCm: number;
  resistenciaVo2max: number;
  resistenciaNivel: number;
  flexibilidadCm: number;
  agilidadSeg: number;
  fechaTest: string;
  observaciones: string;
}

export interface DietPlan {
  id: string;
  jugadorId: string;
  descripcionDieta: string;
  caloriasTotales: number;
  proteinaGr: number;
  carbohidratosGr: number;
  grasasGr: number;
  hidratacionMl: number;
  fechaInicio: string;
  fechaFin: string | null;
  nutricionista: string;
  activo: boolean;
}
