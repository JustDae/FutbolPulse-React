export interface Subscription {
  id: string;
  usuario_id: string;
  usuario_email?: string; 
  plan: 'Basico' | 'Premium';
  estado: 'Activo' | 'Cancelado' | 'Vencido' | 'Suspendido';
  fecha_inicio: string;
  fecha_vencimiento: string;
  metodo_pago?: string;
  referencia_pago?: string;
  creado_en: string;
}

export interface CreateSubscriptionDto {
  usuario_id: string;
  plan: 'Basico' | 'Premium';
  fecha_vencimiento: string;
}
