import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';
import { Card, CardContent } from '../../components/ui/card';
import { matchesCoach } from '@/presentation/utils/name.utils';

export const AdminPlayersPage = () => {
  const { players, isLoading, fetchPlayers, deletePlayer } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();
  const { user } = useAuthStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  const filteredPlayers = teamFilteredPlayers.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (`##${p.jerseyNumber}`).includes(searchTerm) ||
    getTeamName(p.teamId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeamFilter]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Plantilla de Jugadores</h1>
          <p className="text-slate-500 text-sm mt-1">Administra los futbolistas inscritos en el torneo.</p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-200/80 px-6 py-3.5 rounded-xl shadow-sm">
          <div className="text-center">
            <span className="block text-2xl font-bold text-slate-900 leading-none">{displayedPlayers.length}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1 block">Total Jugadores</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, dorsal o equipo..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350 transition-all rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 self-stretch sm:self-auto">
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="flex-1 sm:flex-initial rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 focus:border-slate-300 focus:outline-none transition-all shadow-sm"
          >
            <option value="">Todos los equipos</option>
            {coachTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-[#E31C3D] hover:bg-[#c61834] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo Jugador
          </button>
        </div>
      </div>

      <Card className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin h-8 w-8 text-[#E31C3D] mb-4" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cargando jugadores...</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Futbolista</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Dorsal</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Fecha de nacimiento</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Equipo</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="py-4 px-6 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                            {player.photoUrl ? (
                              <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-4.5 w-4.5 text-slate-400" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-950 text-sm">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-500 text-sm">#{player.jerseyNumber}</td>
                      <td className="py-4 px-6 text-slate-500 text-sm font-medium">{player.birthDate || 'No registrada'}</td>
                      <td className="py-4 px-6">
                        <span className="rounded-lg bg-slate-50 border border-slate-150 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {getTeamName(player.teamId)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          player.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                          {player.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(player)}
                            className="rounded-lg p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(player.id, player.name)}
                            className="rounded-lg p-2 text-slate-400 hover:text-[#E31C3D] hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPlayers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">No se encontraron futbolistas.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">
                    Mostrando <span className="font-bold text-slate-700">{startIndex + 1}</span> a <span className="font-bold text-slate-700">{Math.min(startIndex + itemsPerPage, filteredPlayers.length)}</span> de <span className="font-bold text-slate-700">{filteredPlayers.length}</span> resultados
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200">
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

      <PlayerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        playerToEdit={selectedPlayer}
        defaultTeamId={selectedTeamFilter}
      />
    </div>
  );
};
