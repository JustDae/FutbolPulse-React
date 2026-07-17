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
      {/* Clean SaaS Header */}
      <div className="mb-8 pl-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-gray-900 dark:text-white mb-2">Calendario y Resultados</h1>
          <p className="text-gray-500 dark:text-[#888888] font-normal text-sm">Gestiona la programación y puntuación de los partidos.</p>
        </div>
        <button 
          onClick={() => { setSelectedMatch(null); setIsDialogOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#f94116] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e03a13] shadow-md"
        >
          <Plus className="h-4 w-4" /> Programar Partido
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando calendario...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {matches.map((match) => (
            <div key={match.id} className="rounded-2xl border border-gray-200 dark:border-none bg-white dark:bg-[#1a1a1c] p-6 shadow-sm dark:shadow-none transition-transform hover:scale-[1.02]">
              <div className="mb-5 flex items-center justify-between text-xs text-gray-500 dark:text-[#888888]">
                <div className="flex items-center gap-3">
                  <span>{new Date(match.matchDate).toLocaleString()}</span>
                  <span className="font-semibold bg-gray-100 dark:bg-[#101010] border border-gray-200 dark:border-white/5 px-2.5 py-1 rounded text-gray-600 dark:text-[#888888]">{match.matchType}</span>
                </div>
                <span className={`rounded px-2.5 py-1 font-semibold ${
                  match.status === 'Finalizado' ? 'bg-gray-100 dark:bg-[#101010] text-gray-600 dark:text-[#888888]' :
                  match.status === 'En curso' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 animate-pulse' :
                  'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                  {match.status}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight">
                    {match.equipoLocal}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 rounded-xl bg-gray-50 dark:bg-[#101010] px-5 py-3 text-2xl font-bold text-gray-900 dark:text-white border border-gray-100 dark:border-white/5">
                  <span>{match.homeScore ?? '-'}</span>
                  <span className="text-gray-400 dark:text-zinc-600 text-lg">-</span>
                  <span>{match.awayScore ?? '-'}</span>
                </div>

                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight">
                    {match.equipoVisitante}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-3 border-t border-gray-100 dark:border-white/5 pt-4">
                <button onClick={() => { setSelectedMatch(match); setIsDialogOpen(true); }} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/5 transition-colors">
                  <Edit2 className="h-3.5 w-3.5" /> Editar
                </button>
                <button onClick={() => handleDelete(match.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-500 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
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
