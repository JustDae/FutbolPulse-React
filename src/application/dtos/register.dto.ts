export interface RegisterDto {
  email: string;
  nombre_completo: string;
  tipo_usuario: 'Player' | 'Coach' | 'Scout' | 'Admin';
  password: string;
  password2: string;
}
