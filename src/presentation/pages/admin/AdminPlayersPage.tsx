import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';
import { Card } from '@/presentation/components/ui/card';

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Plantilla de Jugadores</h1>
          <p className="text-sm text-zinc-500 mt-1">Administra los futbolistas inscritos en el torneo.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white cursor-pointer"
          >
            <option value="">Todos los equipos</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nuevo Jugador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-zinc-200 dark:border-zinc-800 bg-card p-4 hover:shadow-md transition-all duration-200">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Jugadores</p>
          <p className="text-2xl font-black text-zinc-950 dark:text-white mt-1">{players.length}</p>
        </Card>
        <Card className="border-zinc-200 dark:border-zinc-800 bg-card p-4 hover:shadow-md transition-all duration-200">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Activos</p>
          <p className="text-2xl font-black text-emerald-650 dark:text-emerald-450 mt-1">
            {players.filter(p => p.isActive).length}
          </p>
        </Card>
        <Card className="border-zinc-200 dark:border-zinc-800 bg-card p-4 hover:shadow-md transition-all duration-200">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Inactivos</p>
          <p className="text-2xl font-black text-red-650 dark:text-red-500 mt-1">
            {players.filter(p => !p.isActive).length}
          </p>
        </Card>
        <Card className="border-zinc-200 dark:border-zinc-800 bg-card p-4 hover:shadow-md transition-all duration-200">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Equipos</p>
          <p className="text-2xl font-black text-zinc-950 dark:text-white mt-1">{teams.length}</p>
        </Card>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500">Cargando jugadores...</div>
      ) : players.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-800">
          No hay jugadores registrados todavía.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-5 py-3.5">Futbolista</th>
                  <th className="px-5 py-3.5">Dorsal</th>
                  <th className="px-5 py-3.5">Fecha de nacimiento</th>
                  <th className="px-5 py-3.5">Equipo</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {(selectedTeamFilter ? players.filter(p => p.teamId === selectedTeamFilter) : players).map((player) => (
                  <tr key={player.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="flex items-center gap-3 px-5 py-4 font-semibold text-zinc-900 dark:text-white">
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                        {player.photoUrl ? (
                          <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-red-500 bg-red-500/10">
                            #{player.jerseyNumber}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-white">{player.name}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-red-600">#{player.jerseyNumber}</td>
                    <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{player.birthDate || 'No registrada'}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 px-2.5 py-1 text-xs font-semibold text-zinc-650 dark:text-zinc-400">
                        {getTeamName(player.teamId)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        player.isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {player.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(player)}
                          className="rounded-lg p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id, player.name)}
                          className="rounded-lg p-2 text-zinc-500 hover:text-red-650 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
