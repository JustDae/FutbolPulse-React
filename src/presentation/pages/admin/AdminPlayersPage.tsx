import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';

export const AdminPlayersPage = () => {
  const { players, isLoading, fetchPlayers, deletePlayer } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plantilla de Jugadores</h1>
          <p className="text-sm text-gray-500">Administra los futbolistas inscritos en el torneo.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="">Todos los equipos</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nuevo Jugador
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Cargando jugadores...</div>
      ) : players.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-gray-500 dark:border-zinc-800">
          No hay jugadores registrados todavía.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500 dark:border-zinc-800 dark:bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3">Futbolista</th>
                <th className="px-4 py-3">Dorsal</th>
                <th className="px-4 py-3">Fecha de nacimiento</th>
                <th className="px-4 py-3">Equipo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {(selectedTeamFilter ? players.filter(p => p.teamId === selectedTeamFilter) : players).map((player) => (
                <tr key={player.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50">
                  <td className="flex items-center gap-3 px-4 py-3 font-medium text-gray-900 dark:text-white">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400">
                          #{player.jerseyNumber}
                        </div>
                      )}
                    </div>
                    <span>{player.name}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600">#{player.jerseyNumber}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{player.birthDate || 'No registrada'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-zinc-800 dark:text-gray-200">
                      {getTeamName(player.teamId)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      player.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                    }`}>
                      {player.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(player)}
                        className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(player.id, player.name)}
                        className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
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
