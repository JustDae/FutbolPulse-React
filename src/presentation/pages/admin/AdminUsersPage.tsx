import { useEffect, useState } from 'react';
import { userRepository } from '@/infrastructure/adapters/axios-user.repository';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import { Loader2, Users, ShieldAlert, ShieldCheck, Mail, UserCog, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/presentation/components/ui/card';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<LoggedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      if (newRole === 'Admin') {
        await userRepository.updateUser(userId, { is_staff: true });
        toast.success('Rol actualizado a Administrador');
        setUsers(prev => prev.map(u => 
          (u.id === userId || u.user_id === userId) ? { ...u, is_staff: true } : u
        ));
      } else {
        await userRepository.updateUser(userId, { is_staff: false, tipo_usuario: newRole });
        toast.success(`Rol actualizado a ${newRole}`);
        setUsers(prev => prev.map(u => 
          (u.id === userId || u.user_id === userId) ? { ...u, is_staff: false, tipo_usuario: newRole } : u
        ));
      }
    } catch (error) {
      toast.error('Error al actualizar el rol');
      console.error(error);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Directorio de Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra los roles, permisos y accesos de todos los usuarios registrados.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-200/80 px-6 py-3.5 rounded-xl shadow-sm">
          <div className="text-center">
            <span className="block text-2xl font-bold text-slate-900 leading-none">{users.length}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Usuarios</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-[#E31C3D] leading-none">{users.filter(u => u.is_staff).length}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Staff / Admins</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350 transition-all rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin h-8 w-8 text-[#E31C3D] mb-4" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cargando directorio...</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Rol en el Sistema</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Nivel Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((u) => {
                    const isUserStaff = !!u.is_staff;
                    const activeDropdownValue = isUserStaff ? 'Admin' : (u.tipo_usuario || 'Player');

                    return (
                      <tr key={u.id || u.user_id || u.email} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 font-semibold text-xs uppercase shrink-0">
                              {(u.nombre_completo || u.username || u.email).charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-950 text-sm">{u.nombre_completo || u.username}</p>
                              <p className="text-[10px] text-slate-400">ID: {(u.id || u.user_id)?.substring(0,8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                            <Mail className="h-4 w-4 text-slate-400" />
                            {u.email}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative inline-flex items-center">
                            <UserCog className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                            <select
                              className="appearance-none pl-10 pr-9 py-2 bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-350 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer outline-none transition-all"
                              value={activeDropdownValue}
                              onChange={(e) => handleChangeRole((u.id || u.user_id)!, e.target.value)}
                            >
                              <option value="Player" className="bg-white text-slate-800">Jugador</option>
                              <option value="Coach" className="bg-white text-slate-800">Entrenador</option>
                              <option value="Scout" className="bg-white text-slate-800">Scout</option>
                              <option value="Admin" className="bg-white text-slate-800">Admin</option>
                            </select>
                            <div className="absolute right-3.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center">
                            {isUserStaff ? (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[10px] uppercase tracking-wider">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Autorizado</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 font-semibold text-[10px] uppercase tracking-wider">
                                <ShieldAlert className="h-3.5 w-3.5" />
                                <span>Estándar</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">No se encontraron usuarios.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">
                    Mostrando <span className="font-bold text-slate-700">{startIndex + 1}</span> a <span className="font-bold text-slate-700">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> de <span className="font-bold text-slate-700">{filteredUsers.length}</span> resultados
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold text-slate-700 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
