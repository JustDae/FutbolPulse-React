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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Calendario y Resultados</h1>
          <p className="text-sm text-zinc-500 mt-1">Gestiona la programación y puntuación de los partidos.</p>
        </div>
        <button 
          onClick={() => { setSelectedMatch(null); setIsDialogOpen(true); }}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Programar Partido
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500">Cargando calendario...</div>
      ) : matches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-800">
          No hay partidos programados todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {matches.map((match) => (
            <div 
              key={match.id} 
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-red-500/5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div>
                <div className="mb-4 flex items-center justify-between text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span>{new Date(match.matchDate).toLocaleString()}</span>
                    <span className="font-bold border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-[9px] uppercase tracking-wider">{match.matchType}</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider ${
                    match.status === 'Finalizado' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400' :
                    match.status === 'En curso' ? 'bg-red-500/10 text-red-650 dark:bg-red-500/25 dark:text-red-400 animate-pulse border border-red-500/20' :
                    'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {match.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex flex-1 flex-col items-center text-center">
                    <span className="font-bold text-zinc-950 dark:text-white text-base">
                      {match.equipoLocal}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 rounded-lg bg-zinc-950 border border-zinc-900 px-4.5 py-1.5 text-2xl font-black text-white font-mono shadow-inner">
                    <span>{match.homeScore ?? '-'}</span>
                    <span className="text-zinc-600 font-semibold">-</span>
                    <span>{match.awayScore ?? '-'}</span>
                  </div>

                  <div className="flex flex-1 flex-col items-center text-center">
                    <span className="font-bold text-zinc-950 dark:text-white text-base">
                      {match.equipoVisitante}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-1.5 border-t border-zinc-100 pt-3.5 dark:border-zinc-900">
                <button 
                  onClick={() => { setSelectedMatch(match); setIsDialogOpen(true); }} 
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" /> Editar Resultado
                </button>
                <button 
                  onClick={() => handleDelete(match.id)} 
                  className="rounded-lg p-2 text-zinc-500 hover:text-red-650 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Eliminar partido"
                >
                  <Trash2 className="h-4.5 w-4.5" />
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
