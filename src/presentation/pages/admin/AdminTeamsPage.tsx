import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Team } from '../../../domain/entities/team.entity';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { TeamDialog } from '../../components/admin/TeamDialog';

export const AdminTeamsPage = () => {
  const { teams, isLoading, fetchTeams, deleteTeam } = useTeamStore();
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const displayedTeams = (user?.tipo_usuario === 'Coach' && !user?.is_staff)
    ? teams.filter(team => team.coach === user.nombre_completo)
    : teams;

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
      {/* Clean SaaS Header */}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Equipos Registrados</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Administra los clubes participantes en tu organización.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#f94116] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e03a13] shadow-md"
        >
          <Plus className="h-4 w-4" />
          Añadir Equipo
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Cargando equipos...</div>
      ) : displayedTeams.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 dark:border-zinc-800 p-12 text-center text-gray-500">
          No tienes equipos asignados en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedTeams.map((team) => (
            <div
              key={team.id}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-none p-6 shadow-sm dark:shadow-none transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-16 w-16 overflow-hidden rounded-full bg-gray-50 dark:bg-[#101010] p-1.5 border border-gray-100 dark:border-white/5">
                  {team.badgeUrl ? (
                    <img src={team.badgeUrl} alt={team.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-gray-400 dark:text-[#888888]">
                      N/A
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight mb-1">{team.name}</h3>
                <p className="text-xs font-medium text-gray-500 dark:text-[#888888]">Coach: {team.coach}</p>
                <span className="mt-3 inline-block rounded bg-gray-100 dark:bg-[#101010] px-2 py-1 text-[10px] font-medium text-gray-500 dark:text-[#888888]">
                  Estadio: {team.stadium || 'N/A'} ({team.foundedYear})
                </span>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 border-t border-gray-100 dark:border-white/5 pt-4">
                <button
                  onClick={() => handleOpenEdit(team)}
                  className="rounded-lg p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  title="Editar equipo"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="rounded-lg p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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