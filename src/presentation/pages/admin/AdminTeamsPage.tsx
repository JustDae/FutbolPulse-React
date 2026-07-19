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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gestión de Equipos</h1>
          <p className="text-sm text-zinc-500 mt-1">Administra los clubes participantes en el torneo.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo Equipo
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500">Cargando equipos...</div>
      ) : teams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-800">
          No hay equipos registrados todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-red-500/5 hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border border-zinc-100 bg-zinc-50/50 p-2 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-center">
                  {team.badgeUrl ? (
                    <img src={team.badgeUrl} alt={team.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-red-500 bg-red-500/10 rounded-full">
                      {(team.name || 'T').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white leading-snug">{team.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 font-medium">DT: {team.coach}</p>
                <span className="mt-2.5 inline-block rounded-full bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50">
                  Estadio: {team.stadium || 'N/A'} ({team.foundedYear})
                </span>
              </div>

              <div className="mt-5 flex items-center justify-end gap-1.5 border-t border-zinc-100 pt-3.5 dark:border-zinc-900">
                <button
                  onClick={() => handleOpenEdit(team)}
                  className="rounded-lg p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Editar equipo"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="rounded-lg p-2 text-zinc-500 hover:text-red-600 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
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