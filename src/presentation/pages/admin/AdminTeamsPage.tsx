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
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1C2B45] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Equipos Registrados
            </h1>
          </div>
          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium pl-5">Administra los clubes participantes en tu organización deportiva.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#E63946] hover:bg-[#c61834] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-[#E63946]/20 active:scale-95 self-start md:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Añadir Equipo
        </button>
      </div>

      {error && (
        <div className="rounded-xl border-l-4 border-[#E63946] bg-red-50 dark:bg-[#E63946]/10 p-4 text-xs text-[#E63946] font-bold">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 dark:text-white/50 font-bold uppercase tracking-widest text-xs">
          Cargando equipos...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {displayedTeams.map((team) => (
            <div
              key={team.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] hover:border-[#E63946]/50 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute right-4 top-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:text-white/40 dark:hover:bg-[#1C2B45] dark:hover:text-white transition-colors cursor-pointer">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 border-slate-200 dark:border-[#1C2B45] bg-white dark:bg-[#10182B] text-slate-800 dark:text-white shadow-2xl">
                    <DropdownMenuItem 
                      onClick={() => handleOpenEdit(team)}
                      className="cursor-pointer gap-2 text-slate-700 dark:text-white/80 focus:bg-slate-100 dark:focus:bg-[#1C2B45]"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(team.id, team.name)}
                      className="cursor-pointer gap-2 text-[#E63946] focus:bg-red-50 dark:focus:bg-[#E63946]/15 focus:text-[#E63946]"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-2xl bg-slate-50 dark:bg-[#0B1220] p-2 border border-slate-200 dark:border-[#1C2B45] shrink-0 shadow-inner group-hover:border-[#E63946]/40 transition-colors">
                  {team.badgeUrl ? (
                    <img src={team.badgeUrl} alt={team.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-black text-[#E63946]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-tight mb-4">
                  {team.name}
                </h3>
                
                <div className="flex flex-col gap-2 w-full bg-slate-50 dark:bg-[#0B1220]/60 rounded-xl p-3.5 border border-slate-200 dark:border-[#1C2B45]/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 dark:text-white/40 font-semibold uppercase text-[10px] tracking-wider">DT</span>
                    <span className="font-medium text-slate-800 dark:text-white truncate max-w-[120px]" title={team.coach}>
                      {team.coach && team.coach !== 'Sin DT' ? team.coach : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 dark:text-white/40 font-semibold uppercase text-[10px] tracking-wider">Estadio</span>
                    <span className="font-medium text-slate-800 dark:text-white truncate max-w-[120px]" title={team.stadium}>
                      {team.stadium && team.stadium !== 'Estadio no asignado' ? team.stadium : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 dark:text-white/40 font-semibold uppercase text-[10px] tracking-wider">Fundado</span>
                    <span className="font-bold text-[#E63946]">
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
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-[#1C2B45] bg-white dark:bg-[#10182B]/40 p-6 transition-all hover:bg-slate-50 dark:hover:bg-[#10182B] cursor-pointer hover:border-[#E63946] group min-h-[280px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#1C2B45]/50 group-hover:bg-[#E63946] transition-colors mb-3 shadow-md">
              <Plus className="h-6 w-6 text-slate-400 dark:text-white/50 group-hover:text-white transition-colors" />
            </div>
            <p className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-white/60 group-hover:text-[#E63946] transition-colors">
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
