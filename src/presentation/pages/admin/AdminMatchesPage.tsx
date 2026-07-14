import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Match } from '../../../domain/entities/match.entity';
import { useMatchStore } from '../../store/match.store';
import { MatchDialog } from '../../components/admin/MatchDialog';

export const AdminMatchesPage = () => {
  const { matches, isLoading, fetchMatches, deleteMatch } = useMatchStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  const handleDelete = async (id: string) => {
    if (confirm('Â¿Eliminar este partido del calendario?')) {
      try {
        await deleteMatch(id);
        toast.success('Partido eliminado');
      } catch (error) {
        toast.error('Error al eliminar el partido');
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Calendario y Resultados</h1>
        <button 
          onClick={() => { setSelectedMatch(null); setIsDialogOpen(true); }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Programar Partido
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando calendario...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {matches.map((match) => (
            <div key={match.id} className="rounded-lg border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span>{new Date(match.matchDate).toLocaleString()}</span>
                  <span className="font-bold border px-2 py-0.5 rounded">{match.matchType}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 font-medium ${
                  match.status === 'Finalizado' ? 'bg-gray-100 text-gray-700' :
                  match.status === 'En curso' ? 'bg-red-100 text-red-700 animate-pulse' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {match.status}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="font-bold dark:text-white">
                    {match.equipoLocal}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 rounded bg-gray-50 px-4 py-2 text-2xl font-black dark:bg-zinc-800 dark:text-white">
                  <span>{match.homeScore ?? '-'}</span>
                  <span className="text-gray-400">-</span>
                  <span>{match.awayScore ?? '-'}</span>
                </div>

                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="font-bold dark:text-white">
                    {match.equipoVisitante}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t pt-3 dark:border-zinc-800">
                <button onClick={() => { setSelectedMatch(match); setIsDialogOpen(true); }} className="flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50">
                  <Edit2 className="h-4 w-4" /> Editar Resultado
                </button>
                <button onClick={() => handleDelete(match.id)} className="rounded px-2 py-1.5 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MatchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        matchToEdit={selectedMatch}
      />
    </div>
  );
};
