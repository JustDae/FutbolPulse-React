import { useEffect, useState } from 'react';
import { userRepository } from '@/infrastructure/adapters/axios-user.repository';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Loader2, Users, ShieldAlert, ShieldCheck, Mail, UserCog, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

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

  const filteredUsers = users.filter(u => 
    (u.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Clean SaaS Header */}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Directorio de Usuarios</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Administra los roles, permisos y accesos de todos los usuarios registrados.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-[#1a1a1c] px-6 py-3 rounded-2xl border border-gray-200 dark:border-white/5">
          <div className="text-center">
            <span className="block text-2xl font-semibold text-gray-900 dark:text-white">{users.length}</span>
            <span className="text-[10px] uppercase text-gray-500 dark:text-[#888888] font-medium">Total Usuarios</span>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
          <div className="text-center">
            <span className="block text-2xl font-semibold text-[#f94116]">{users.filter(u => u.is_staff).length}</span>
            <span className="text-[10px] uppercase text-gray-500 dark:text-[#888888] font-medium">Staff / Admins</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#888888]" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#888888] focus:outline-none focus:ring-1 focus:ring-[#f94116] transition-all shadow-sm dark:shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border border-gray-200 dark:border-none shadow-sm dark:shadow-none rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1c]">
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center p-20">
               <Loader2 className="animate-spin h-8 w-8 text-[#f94116] mb-4" />
               <p className="text-xs font-medium text-[#888888]">Cargando directorio...</p>
             </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/5">
                    <th className="py-4 px-6 text-[11px] font-medium text-gray-500 dark:text-[#888888]">Usuario</th>
                    <th className="py-4 px-6 text-[11px] font-medium text-gray-500 dark:text-[#888888]">Contacto</th>
                    <th className="py-4 px-6 text-[11px] font-medium text-gray-500 dark:text-[#888888]">Rol en el Sistema</th>
                    <th className="py-4 px-6 text-[11px] font-medium text-gray-500 dark:text-[#888888] text-center">Nivel Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {paginatedUsers.map((u) => (
                    <tr key={u.id || u.user_id || u.email} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#101010] border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-[#888888] font-medium text-xs uppercase shrink-0">
                            {(u.nombre_completo || u.username || u.email).charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{u.nombre_completo || u.username}</p>
                            <p className="text-xs text-gray-500 dark:text-[#888888]">ID: {(u.id || u.user_id)?.substring(0,8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-[#888888] text-sm">
                          <Mail className="h-4 w-4 text-gray-400 dark:text-[#888888]" />
                          {u.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative inline-flex items-center">
                          <UserCog className="absolute left-3 h-3.5 w-3.5 text-gray-500 dark:text-[#888888] pointer-events-none" />
                          <select
                            className={`appearance-none pl-9 pr-8 py-1.5 rounded-lg text-xs font-medium cursor-pointer outline-none transition-all ${u.tipo_usuario === 'Admin' ? 'bg-[#f94116]/10 text-[#f94116] border border-[#f94116]/20' : 'bg-gray-100 dark:bg-[#101010] text-gray-700 dark:text-[#888888] border border-gray-200 dark:border-none'}`}
                            value={u.tipo_usuario || 'Player'}
                            onChange={(e) => handleChangeRole((u.id || u.user_id)!, e.target.value)}
                          >
                            <option value="Player" className="bg-white text-gray-900 dark:bg-[#101010] dark:text-white">Jugador</option>
                            <option value="Coach" className="bg-white text-gray-900 dark:bg-[#101010] dark:text-white">Entrenador</option>
                            <option value="Scout" className="bg-white text-gray-900 dark:bg-[#101010] dark:text-white">Scout</option>
                            <option value="Admin" className="bg-white text-gray-900 dark:bg-[#101010] dark:text-white">Admin</option>
                          </select>
                          <div className="absolute right-3 pointer-events-none text-gray-400 dark:text-[#888888] opacity-50">▼</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          {u.is_staff ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-medium">Autorizado</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#101010] text-gray-600 dark:text-[#888888] border border-gray-200 dark:border-none">
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-medium">Estándar</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <Users className="h-12 w-12 text-gray-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-slate-500 font-medium">No se encontraron usuarios.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#101010]">
                  <p className="text-xs text-gray-500 dark:text-[#888888]">
                    Mostrando <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}</span> a <span className="font-medium text-gray-900 dark:text-white">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> de <span className="font-medium text-gray-900 dark:text-white">{filteredUsers.length}</span> resultados
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded-md text-gray-500 dark:text-[#888888] hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1c] px-3 py-1 rounded-md border border-gray-200 dark:border-white/5">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded-md text-gray-500 dark:text-[#888888] hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

