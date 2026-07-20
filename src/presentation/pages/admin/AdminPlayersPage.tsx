import { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';
import { matchesCoach } from '../../utils/name.utils';

export const AdminPlayersPage = () => {
  const { players, isLoading, fetchPlayers, deletePlayer } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();
  const { user } = useAuthStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const itemsPerPage = 10;

  const coachTeams = (user?.tipo_usuario === 'Coach' && !user?.is_staff)
    ? teams.filter(team => matchesCoach(team.coach, user.nombre_completo))
    : teams;

  const allowedTeamIds = coachTeams.map(t => t.id);

  const displayedPlayers = (user?.tipo_usuario === 'Coach' && !user?.is_staff)
    ? players.filter(player => allowedTeamIds.includes(player.teamId))
    : players;

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, [fetchPlayers, fetchTeams]);

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Equipo desconocido';
  };

  const handleOpenCreate = () => {
    setSelectedPlayer(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar al jugador "${name}"?`)) {
      try {
        await deletePlayer(id);
        toast.success('Jugador eliminado correctamente');
      } catch (error) {
        toast.error('No se pudo eliminar el jugador');
      }
    }
  };

  const teamFilteredPlayers = selectedTeamFilter
    ? displayedPlayers.filter(p => p.teamId === selectedTeamFilter)
    : displayedPlayers;

  const statusFilteredPlayers = filterStatus === 'all'
    ? teamFilteredPlayers
    : teamFilteredPlayers.filter(p => filterStatus === 'active' ? p.isActive : !p.isActive);

  const filteredPlayers = statusFilteredPlayers.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (`#${p.jerseyNumber}`).includes(searchTerm) ||
    getTeamName(p.teamId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeamFilter, filterStatus]);

  const activeCount = displayedPlayers.filter(p => p.isActive).length;
  const inactiveCount = displayedPlayers.filter(p => !p.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1C2B45] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E31C3D] rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Plantilla de Jugadores
            </h1>
          </div>
          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium pl-5">Gestión de la plantilla federada y fichas de atletas.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#E31C3D] hover:bg-[#c61834] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-[#E31C3D]/20 active:scale-95 self-start md:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Nuevo Jugador
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] rounded-2xl p-4 shadow-md">
          <div className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{displayedPlayers.length}</div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-white/40 mt-1">Total Registrados</div>
        </div>
        <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] rounded-2xl p-4 shadow-md">
          <div className="text-3xl font-black text-emerald-500 dark:text-emerald-400" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeCount}</div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-white/40 mt-1">Activos</div>
        </div>
        <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] rounded-2xl p-4 shadow-md">
          <div className="text-3xl font-black text-slate-400 dark:text-white/50" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{inactiveCount}</div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-white/40 mt-1">Inactivos</div>
        </div>
        <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] rounded-2xl p-4 shadow-md">
          <div className="text-3xl font-black text-[#E31C3D]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{coachTeams.length}</div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-white/40 mt-1">Equipos</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-[#1C2B45] bg-slate-50/50 dark:bg-[#1C2B45]/30">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/40" />
              <input
                type="text"
                placeholder="Buscar jugador por nombre o dorsal..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#E31C3D] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2.5 text-xs bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] rounded-xl text-slate-800 dark:text-white/80 focus:outline-none focus:border-[#E31C3D] transition-all"
            >
              <option value="">Todos los equipos</option>
              {coachTeams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full md:w-auto px-4 py-2.5 text-xs bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] rounded-xl text-slate-800 dark:text-white/80 focus:outline-none focus:border-[#E31C3D] transition-all"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-[#1C2B45] bg-slate-50 dark:bg-[#1C2B45]/40 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-white/60">
              <tr>
                <th className="py-4 px-6">Jugador</th>
                <th className="py-4 px-6">Dorsal</th>
                <th className="py-4 px-6 hidden md:table-cell">Fecha Nac.</th>
                <th className="py-4 px-6">Equipo</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1C2B45]/50 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-[#E31C3D] mx-auto mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/50">Cargando plantilla...</p>
                  </td>
                </tr>
              ) : paginatedPlayers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Users className="h-12 w-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">No se encontraron jugadores</p>
                  </td>
                </tr>
              ) : (
                paginatedPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-50 dark:hover:bg-[#1C2B45]/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] flex items-center justify-center text-xs font-bold text-[#E31C3D] overflow-hidden shrink-0 shadow-inner">
                          {player.photoUrl ? (
                            <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-[#E31C3D]" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{player.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-bold text-[#E31C3D] bg-[#E31C3D]/10 px-2.5 py-1 rounded-lg border border-[#E31C3D]/20">
                        #{player.jerseyNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-white/70">
                      {player.birthDate ? new Date(player.birthDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-medium">
                      {getTeamName(player.teamId)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg ${player.isActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${player.isActive ? 'bg-emerald-400' : 'bg-slate-400 dark:bg-white/40'}`} />
                        {player.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(player)}
                          className="rounded-lg p-2 text-slate-400 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="Editar jugador"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id, player.name)}
                          className="rounded-lg p-2 text-slate-400 hover:text-[#E31C3D] hover:bg-red-50 dark:text-white/60 dark:hover:text-[#E31C3D] dark:hover:bg-[#E31C3D]/10 transition-colors cursor-pointer"
                          title="Eliminar jugador"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-[#1C2B45] flex items-center justify-between bg-slate-50/50 dark:bg-[#1C2B45]/20">
            <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1C2B45] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <PlayerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        playerToEdit={selectedPlayer}
      />
    </div>
  );
};