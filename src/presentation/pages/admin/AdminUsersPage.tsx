import { useEffect, useState } from 'react';
import { userRepository } from '@/infrastructure/adapters/axios-user.repository';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<LoggedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userRepository.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await userRepository.updateUser(userId, { tipo_usuario: newRole });
      toast.success(`Rol actualizado a ${newRole}`);
      setUsers(prev => prev.map(u => 
        (u.id === userId || u.user_id === userId) ? { ...u, tipo_usuario: newRole } : u
      ));
    } catch (error) {
      toast.error('Error al actualizar el rol');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Usuarios</h1>
        <p className="text-sm text-gray-500">Administra los usuarios y asigna roles (Admin, Coach, Jugador, etc).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directorio de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rol</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Admin/Staff</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {users.map(u => (
                    <tr key={u.id || u.user_id || u.email} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{u.nombre_completo || u.username}</td>
                      <td className="p-4 align-middle">{u.email}</td>
                      <td className="p-4 align-middle">
                        <select
                          className="rounded-md border border-gray-300 px-2 py-1 text-xs font-semibold bg-primary/10 text-primary focus:outline-none"
                          value={u.tipo_usuario || 'Player'}
                          onChange={(e) => handleChangeRole((u.id || u.user_id)!, e.target.value)}
                        >
                          <option value="Player">Jugador (Player)</option>
                          <option value="Coach">Entrenador (Coach)</option>
                          <option value="Scout">Scout</option>
                          <option value="Admin">Administrador (Admin)</option>
                        </select>
                      </td>
                      <td className="p-4 align-middle">
                        {u.is_staff ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
