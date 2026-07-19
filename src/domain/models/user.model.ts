export interface UserModel {
  id: string;
  username: string;
  email: string;
  tipo_usuario: 'Player' | 'Coach' | 'Admin' | 'Scout';
  createdAt?: string;
}
