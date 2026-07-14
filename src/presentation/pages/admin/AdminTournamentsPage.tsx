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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Torneos</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Nuevo Torneo
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500 dark:border-zinc-800 dark:bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Entidad</th>
                <th className="px-4 py-3">Edades</th>
                <th className="px-4 py-3">Género</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium dark:text-white">{t.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t.nombreEntidad || t.entidadId}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {t.minAge || t.maxAge ? `${t.minAge || '0'} - ${t.maxAge || '��~'}` : 'Sin límite'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t.gender}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {t.isActive ? 'Activo' : 'Finalizado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        title="Editar torneo"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(t.id, t.name)} className="text-red-600 hover:bg-red-50 p-1.5 rounded">
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
