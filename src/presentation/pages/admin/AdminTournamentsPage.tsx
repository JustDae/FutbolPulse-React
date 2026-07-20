import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Tournament } from '@/domain/entities/tournament.entity';
import { TournamentDialog } from '@/presentation/components/admin/TournamentDialog';
import { useTournamentStore } from '../../store/tournament.store';

export const AdminTournamentsPage = () => {
  const { tournaments, isLoading, fetchTournaments, deleteTournament } = useTournamentStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleOpenCreate = () => {
    setSelectedTournament(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar el torneo "${name}"?`)) {
      try {
        await deleteTournament(id);
        toast.success('Torneo eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1C2B45] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E31C3D] rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Gestión de Torneos
            </h1>
          </div>
          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium pl-5">Crea, configura y gestiona las competiciones oficiales del sistema.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#E31C3D] hover:bg-[#c61834] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-[#E31C3D]/20 active:scale-95 self-start md:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Nuevo Torneo
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 dark:text-white/50 font-bold uppercase tracking-widest text-xs">
          Cargando torneos...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1C2B45] bg-white dark:bg-[#10182B] shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-[#1C2B45] bg-slate-50 dark:bg-[#1C2B45]/40 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-white/60">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Entidad</th>
                <th className="px-6 py-4">Edades</th>
                <th className="px-6 py-4">Género</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1C2B45]/50 text-xs">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-[#1C2B45]/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{t.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-white/70">{t.nombreEntidad || t.entidadId}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-white/70">
                    {t.minAge || t.maxAge ? `${t.minAge || '0'} - ${t.maxAge || '∞'} años` : 'Sin límite'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-white/70">{t.gender}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${t.isActive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10'}`}>
                      {t.isActive ? 'Activo' : 'Finalizado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="rounded-lg p-2 text-slate-400 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        title="Editar torneo"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id, t.name)} 
                        className="rounded-lg p-2 text-slate-400 hover:text-[#E31C3D] hover:bg-red-50 dark:text-white/60 dark:hover:text-[#E31C3D] dark:hover:bg-[#E31C3D]/10 transition-colors cursor-pointer"
                        title="Eliminar torneo"
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

      <TournamentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        tournamentToEdit={selectedTournament}
      />
    </div>
  );
};
