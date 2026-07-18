import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { toast } from 'sonner';

import type { Team } from '../../../domain/entities/team.entity';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { TeamDialog } from '../../components/admin/TeamDialog';
import { matchesCoach } from '@/presentation/utils/name.utils';

export const AdminTeamsPage = () => {
  const { teams, isLoading, fetchTeams, deleteTeam, error } = useTeamStore();
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const displayedTeams = (user?.tipo_usuario === 'Coach' && !user?.is_staff)
    ? teams.filter(team => matchesCoach(team.coach, user.nombre_completo))
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
      {}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Equipos Registrados</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Administra los clubes participantes en tu organización.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 shadow-md"
        >
          <Plus className="h-4 w-4" />
          Añadir Equipo
        </button>
      </div>

      {error && (
        <div className="rounded-none border-l-4 border-[#e63946] bg-red-50 p-4 text-sm text-[#e63946] font-bold">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Cargando equipos...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {displayedTeams.map((team) => (
            <div
              key={team.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0F1520] border border-gray-200 dark:border-white/10 p-5 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <div className="absolute right-4 top-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F1520] shadow-xl">
                    <DropdownMenuItem 
                      onClick={() => handleOpenEdit(team)}
                      className="cursor-pointer gap-2 text-gray-700 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-white/10"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(team.id, team.name)}
                      className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="mb-4 h-16 w-16 overflow-hidden rounded-full bg-gray-50 dark:bg-[#1a2332] p-1.5 border border-gray-100 dark:border-white/5 shrink-0">
                  {team.badgeUrl ? (
                    <img src={team.badgeUrl} alt={team.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-400 dark:text-[#888888]">
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight leading-tight mb-3">
                  {team.name}
                </h3>
                
                <div className="flex flex-col gap-1.5 w-full bg-gray-50 dark:bg-[#1a2332]/50 rounded-xl p-3 border border-gray-100 dark:border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 dark:text-[#888888]">DT</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]" title={team.coach}>
                      {team.coach && team.coach !== 'Sin DT' ? team.coach : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 dark:text-[#888888]">Estadio</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]" title={team.stadium}>
                      {team.stadium && team.stadium !== 'Estadio no asignado' ? team.stadium : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 dark:text-[#888888]">Fundado</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {team.foundedYear > 0 ? team.foundedYear : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Tarjeta fantasma para añadir equipo */}
          <div 
            onClick={handleOpenCreate}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#0F1520]/50 p-6 transition-all hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer hover:border-emerald-500/50 group min-h-[260px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 group-hover:bg-emerald-500/10 transition-colors mb-3">
              <Plus className="h-6 w-6 text-gray-400 dark:text-[#888888] group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="font-medium text-gray-500 dark:text-[#888888] group-hover:text-emerald-500 transition-colors">
              Añadir nuevo equipo
            </p>
          </div>
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