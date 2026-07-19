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
    <div className="space-y-6 p-6">
      {}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Gestión de Torneos</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Crea y configura las competiciones de tu organización.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#f94116] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e03a13] shadow-md"
        >
          <Plus className="h-4 w-4" /> Nuevo Torneo
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-none bg-white dark:bg-[#1a1a1c] shadow-sm dark:shadow-none">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/5 text-xs font-medium text-gray-500 dark:text-[#888888]">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Entidad</th>
                <th className="px-6 py-4">Edades</th>
                <th className="px-6 py-4">Género</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{t.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-[#888888]">{t.nombreEntidad || t.entidadId}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-[#888888]">
                    {t.minAge || t.maxAge ? `${t.minAge || '0'} - ${t.maxAge || '∞'}` : 'Sin límite'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-[#888888]">{t.gender}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${t.isActive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' : 'bg-gray-100 text-gray-600 dark:bg-[#101010] dark:text-[#888888]'}`}>
                      {t.isActive ? 'Activo' : 'Finalizado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="rounded-lg p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        title="Editar torneo"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(t.id, t.name)} className="rounded-lg p-2 text-gray-500 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-500 dark:hover:bg-red-500/10 transition-colors">
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
