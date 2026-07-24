import { useEffect, useState } from 'react';
import { userRepository } from '@/infrastructure/adapters/axios-user.repository';
import { subscriptionRepository } from '@/infrastructure/adapters/axios-subscription.repository';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import { Loader2, Users, ShieldAlert, ShieldCheck, Mail, UserCog, Search, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
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

  const handleMakePremium = async (userId: string) => {
    try {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      await subscriptionRepository.createSubscription({
        usuario_id: userId,
        plan: 'Premium',
        fecha_vencimiento: nextYear.toISOString().split('T')[0]
      });
      toast.success('¡Suscripción Premium asignada con éxito!');
    } catch (error) {
      toast.error('Error al asignar Premium (quizá ya tenga una suscripción activa)');
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
  const staffCount = users.filter(u => u.is_staff).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1C2B45] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Directorio de Usuarios
            </h1>
          </div>
          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium pl-5">Asigna roles, administra permisos y consulta el estado de las cuentas.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
            <span className="text-slate-400 dark:text-white/50 uppercase tracking-widest text-[10px] mr-2">Total:</span>
            <span className="text-[#E63946] font-black text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{users.length}</span>
          </div>
          <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
            <span className="text-slate-400 dark:text-white/50 uppercase tracking-widest text-[10px] mr-2">Staff:</span>
            <span className="text-amber-500 font-black text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{staffCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o email..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#E63946] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border border-slate-200 dark:border-[#1C2B45] rounded-2xl overflow-hidden bg-white dark:bg-[#10182B] shadow-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin h-8 w-8 text-[#E63946] mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/50">Cargando directorio...</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#1C2B45] bg-slate-50 dark:bg-[#1C2B45]/40 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-white/60">
                    <th className="py-4 px-6">Usuario</th>
                    <th className="py-4 px-6">Contacto</th>
                    <th className="py-4 px-6">Rol en el Sistema</th>
                    <th className="py-4 px-6 text-center">Nivel Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1C2B45]/50 text-xs">
                  {paginatedUsers.map((u) => {
                    const isUserStaff = !!u.is_staff;
                    const activeDropdownValue = isUserStaff ? 'Admin' : (u.tipo_usuario || 'Player');

                    return (
                      <tr key={u.id || u.user_id || u.email} className="hover:bg-slate-50 dark:hover:bg-[#1C2B45]/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] flex items-center justify-center text-[#E63946] font-extrabold text-xs uppercase shrink-0 shadow-inner">
                              {(u.nombre_completo || u.username || u.email).charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{u.nombre_completo || u.username}</p>
                              <p className="text-[10px] text-slate-400 dark:text-white/40 font-mono">ID: {(u.id || u.user_id)?.substring(0,8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-white/80 text-xs font-semibold">
                            <Mail className="h-4 w-4 text-slate-400 dark:text-white/40" />
                            {u.email}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative inline-flex items-center">
                              <UserCog className="absolute left-3.5 h-3.5 w-3.5 text-[#E63946] pointer-events-none" />
                              <select
                                className="appearance-none pl-10 pr-9 py-2 bg-slate-50 dark:bg-[#0B1220] text-slate-800 dark:text-white border border-slate-200 dark:border-[#1C2B45] hover:border-[#E63946] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer outline-none transition-all"
                                value={activeDropdownValue}
                                onChange={(e) => handleChangeRole((u.id || u.user_id)!, e.target.value)}
                              >
                                <option value="Player">Jugador</option>
                                <option value="Coach">Entrenador</option>
                                <option value="Scout">Scout</option>
                                <option value="Admin">Admin</option>
                              </select>
                              <div className="absolute right-3.5 pointer-events-none text-slate-400 dark:text-white/40 text-[10px]">▼</div>
                            </div>
                            <button 
                              onClick={() => handleMakePremium((u.id || u.user_id)!)}
                              className="p-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors border border-amber-500/20"
                              title="Asignar Plan Premium"
                            >
                              <Crown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center">
                            {isUserStaff ? (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-extrabold text-[10px] uppercase tracking-wider">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Autorizado</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10 font-extrabold text-[10px] uppercase tracking-wider">
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
                        <Users className="h-12 w-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                        <p className="text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider text-xs">No se encontraron usuarios.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-[#1C2B45] bg-slate-50/50 dark:bg-[#1C2B45]/20">
                  <p className="text-[10px] font-extrabold text-slate-500 dark:text-white/40 uppercase tracking-widest">
                    Mostrando <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> a <span className="font-bold text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> de <span className="font-bold text-slate-900 dark:text-white">{filteredUsers.length}</span> resultados
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#1C2B45] bg-slate-100 dark:bg-[#0B1220] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-[#0B1220] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1C2B45]">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#1C2B45] bg-slate-100 dark:bg-[#0B1220] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
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
