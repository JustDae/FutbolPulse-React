import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Team } from '../../../domain/entities/team.entity';
import { useTeamStore } from '../../store/team.store';
import { TeamDialog } from '../../components/admin/TeamDialog';

export const AdminTeamsPage = () => {
  const { teams, isLoading, fetchTeams, deleteTeam } = useTeamStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleOpenCreate = () => {
    setSelectedTeam(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el equipo "${name}"?`)) {
      try {
        await deleteTeam(id);
        toast.success('Equipo eliminado correctamente');
      } catch (error) {
        toast.error('No se pudo eliminar el equipo');
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Equipos</h1>
          <p className="text-sm text-gray-500">Administra los clubes participantes en el torneo.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Equipo
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Cargando equipos...</div>
      ) : teams.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-gray-500 dark:border-zinc-800">
          No hay equipos registrados todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex flex-col justify-between rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 h-20 w-20 overflow-hidden rounded-full border bg-gray-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
                  {team.badgeUrl ? (
                    <img src={team.badgeUrl} alt={team.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400">
                      SIN ESCUDO
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{team.name}</h3>
                <p className="text-xs text-gray-500">DT: {team.coach}</p>
                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                  Estadio: {team.stadium || 'N/A'} ({team.foundedYear})
                </span>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3 dark:border-zinc-800">
                <button
                  onClick={() => handleOpenEdit(team)}
                  className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  title="Editar equipo"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Eliminar equipo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeamDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        teamToEdit={selectedTeam}
      />
    </div>
  );
};