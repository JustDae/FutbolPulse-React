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

  const handleOpenCreate = () => {
    setSelectedMatch(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (match: Match) => {
    setSelectedMatch(match);
    setIsDialogOpen(true);
  };

  // Mocks para mantener compatibilidad con el nuevo layout solicitado
  const getTournamentName = (_id: string) => "Torneo Principal";
  const getStatusBadge = (status: string) =>
    status === 'Finalizado' ? 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60' :
    status === 'En curso' ? 'bg-[#E31C3D]/20 text-[#E31C3D]' :
    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1C2B45] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E31C3D] rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Calendario de Partidos
            </h1>
          </div>
          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium pl-5">Programa partidos, actualiza marcadores en tiempo real y gestiona las fechas.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#E31C3D] hover:bg-[#c61834] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-[#E31C3D]/20 active:scale-95 self-start md:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Programar Partido
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 dark:text-white/50 font-bold uppercase tracking-widest text-xs">
          Cargando partidos...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#10182B] border border-slate-200 dark:border-[#1C2B45] hover:border-[#E31C3D]/50 p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Header card info */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1C2B45] pb-3 mb-4 text-xs">
                <span className="text-slate-500 dark:text-white/50 font-bold uppercase text-[10px] tracking-wider truncate max-w-[150px]">
                  {match.matchType || getTournamentName(match.tournamentId)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${getStatusBadge(match.status)}`}>
                  {match.status}
                </span>
              </div>

              {/* Match Scoreboard display */}
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {match.equipoLocal}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase mt-0.5">Local</span>
                </div>

                <div className="flex items-center justify-center gap-3 rounded-2xl bg-slate-50 dark:bg-[#0B1220] px-5 py-3 text-2xl font-black text-slate-900 dark:text-white border border-slate-200 dark:border-[#1C2B45] shadow-inner" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <span className="text-[#E31C3D]">{match.homeScore ?? '-'}</span>
                  <span className="text-slate-300 dark:text-white/30 text-lg font-normal">:</span>
                  <span>{match.awayScore ?? '-'}</span>
                </div>

                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {match.equipoVisitante}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase mt-0.5">Visitante</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 dark:border-[#1C2B45]/60 pt-4">
                <button
                  onClick={() => handleOpenEdit(match)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#E31C3D] hover:bg-red-50 dark:text-white/60 dark:hover:text-[#E31C3D] dark:hover:bg-[#E31C3D]/10 transition-colors cursor-pointer"
                >
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
