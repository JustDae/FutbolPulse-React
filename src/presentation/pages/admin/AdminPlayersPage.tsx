import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';

export const AdminPlayersPage = () => {
  const { players, isLoading, fetchPlayers, deletePlayer } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();
  const { user } = useAuthStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');

  const coachTeams = (user?.tipo_usuario === 'Coach' && !user?.is_staff)
    ? teams.filter(team => team.coach === user.nombre_completo)
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

  return (
    <div className="space-y-6 p-6">
      {/* Clean SaaS Header */}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Plantilla de Jugadores</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Administra los futbolistas inscritos en el torneo.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#1a1a1c] px-4 py-2.5 text-sm text-gray-700 dark:text-[#888888] focus:border-[#f94116] focus:outline-none transition-colors"
          >
            <option value="">Todos mis equipos</option>
            {coachTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-[#f94116] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e03a13] shadow-md"
          >
            <Plus className="h-4 w-4" />
            Nuevo Jugador
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Cargando jugadores...</div>
      ) : displayedPlayers.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-gray-500 dark:border-zinc-800">
          No tienes jugadores registrados todavía.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-none bg-white dark:bg-[#1a1a1c] shadow-sm dark:shadow-none">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/5 text-xs font-medium text-gray-500 dark:text-[#888888]">
              <tr>
                <th className="px-6 py-4">Futbolista</th>
                <th className="px-6 py-4">Dorsal</th>
                <th className="px-6 py-4">Fecha de nacimiento</th>
                <th className="px-6 py-4">Equipo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {(selectedTeamFilter ? displayedPlayers.filter(p => p.teamId === selectedTeamFilter) : displayedPlayers).map((player) => (
                <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="flex items-center gap-4 px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100 dark:bg-[#101010] border border-gray-200 dark:border-white/5">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-gray-500 dark:text-[#888888]">
                          #{player.jerseyNumber}
                        </div>
                      )}
                    </div>
                    <span>{player.name}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-600 dark:text-[#888888]">#{player.jerseyNumber}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-[#888888] font-medium">{player.birthDate || 'No registrada'}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-gray-100 dark:bg-[#101010] px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-[#888888]">
                      {getTeamName(player.teamId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      player.isActive 
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' 
                        : 'bg-gray-100 text-gray-600 dark:bg-[#101010] dark:text-[#888888]'
                    }`}>
                      {player.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(player)}
                        className="rounded-lg p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(player.id, player.name)}
                        className="rounded-lg p-2 text-gray-500 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PlayerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        playerToEdit={selectedPlayer}
        defaultTeamId={selectedTeamFilter}
      />
    </div>
  );
};
