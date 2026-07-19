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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gestión de Usuarios</h1>
        <p className="text-sm text-zinc-500 mt-1">Administra los usuarios y asigna roles (Admin, Coach, Jugador, etc).</p>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 bg-card">
        <CardHeader>
          <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Directorio de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-red-600" /></div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-850">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <tr>
                      <th className="px-5 py-3.5">Nombre</th>
                      <th className="px-5 py-3.5">Email</th>
                      <th className="px-5 py-3.5">Rol</th>
                      <th className="px-5 py-3.5">Admin/Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {users.map(u => (
                      <tr key={u.id || u.user_id || u.email} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                        <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-white">{u.nombre_completo || u.username}</td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{u.email}</td>
                        <td className="px-5 py-4">
                          <select
                            className="rounded-lg border border-red-500/10 bg-red-500/5 px-2.5 py-1.5 text-xs font-semibold text-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-red-500/20 dark:bg-zinc-900 dark:text-red-400 cursor-pointer"
                            value={u.tipo_usuario || 'Player'}
                            onChange={(e) => handleChangeRole((u.id || u.user_id)!, e.target.value)}
                          >
                            <option value="Player" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Jugador (Player)</option>
                            <option value="Coach" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Entrenador (Coach)</option>
                            <option value="Scout" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Scout</option>
                            <option value="Admin" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Administrador (Admin)</option>
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          {u.is_staff ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-zinc-200 dark:text-zinc-800" />
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-5 text-center text-zinc-400">
                          No hay usuarios registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
