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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gestión de Torneos</h1>
          <p className="text-sm text-zinc-500 mt-1">Crea y configura las competiciones de tu organización.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Nuevo Torneo
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500">Cargando torneos...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-5 py-3.5">Nombre</th>
                  <th className="px-5 py-3.5">Entidad</th>
                  <th className="px-5 py-3.5">Edades</th>
                  <th className="px-5 py-3.5">Género</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {tournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-white">{t.name}</td>
                    <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{t.nombreEntidad || t.entidadId}</td>
                    <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                      {t.minAge || t.maxAge ? `${t.minAge || '0'} - ${t.maxAge || '∞'}` : 'Sin límite'}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{t.gender}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        t.isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400'
                      }`}>
                        {t.isActive ? 'Activo' : 'Finalizado'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="rounded-lg p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Editar torneo"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id, t.name)} 
                          className="rounded-lg p-2 text-zinc-500 hover:text-red-600 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Eliminar torneo"
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

      <TournamentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        tournamentToEdit={selectedTournament}
      />
    </div>
  );
};
