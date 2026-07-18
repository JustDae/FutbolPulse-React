import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';
import { Card, CardContent } from '../../components/ui/card';
import { matchesCoach } from '@/presentation/utils/name.utils';

export const AdminPlayersPage = () => {
  const { players, isLoading, fetchPlayers, deletePlayer } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();
  const { user } = useAuthStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const coachTeams = (user?.tipo_usuario === 'Coach' && !user?.is_staff)
    ? teams.filter(team => matchesCoach(team.coach, user.nombre_completo))
    : teams;

  const allowedTeamIds = coachTeams.map(t => t.id);

  const displayedPlayers = (user?.tipo_usuario === 'Coach' && !user?.is_staff)
    ? players.filter(player => allowedTeamIds.includes(player.teamId))
    : players;

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, [fetchPlayers, fetchTeams]);

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Equipo desconocido';
  };

  const handleOpenCreate = () => {
    setSelectedPlayer(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar al jugador "${name}"?`)) {
      try {
        await deletePlayer(id);
        toast.success('Jugador eliminado correctamente');
      } catch (error) {
        toast.error('No se pudo eliminar el jugador');
      }
    }
  };

  const teamFilteredPlayers = selectedTeamFilter
    ? displayedPlayers.filter(p => p.teamId === selectedTeamFilter)
    : displayedPlayers;

  const filteredPlayers = teamFilteredPlayers.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (`##${p.jerseyNumber}`).includes(searchTerm) ||
    getTeamName(p.teamId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeamFilter]);

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-2xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Plantilla de Jugadores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra los futbolistas inscritos en el torneo.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-card px-5 py-3 rounded-xl border border-border shadow-sm">
          <div className="text-center">
            <span className="block text-2xl font-bold text-primary leading-none">
              {displayedPlayers.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Total Jugadores
            </span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-foreground leading-none">
              {coachTeams.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Equipos
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, dorsal o equipo..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="flex-1 sm:w-48 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Todos los equipos</option>
            {coachTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <Button
            variant="action"
            onClick={handleOpenCreate}
            className="whitespace-nowrap rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Jugador
          </Button>
        </div>
      </div>

      <Card className="border border-border rounded-xl overflow-hidden shadow-lg">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Cargando jugadores...
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20">
                    <th className="py-4 px-6 text-xs font-bold text-foreground uppercase tracking-wider">
                      Futbolista
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-foreground uppercase tracking-wider">
                      Dorsal
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-foreground uppercase tracking-wider">
                      Fecha de nacimiento
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-foreground uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-foreground uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-foreground uppercase tracking-wider text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-muted/30 transition-colors duration-150 group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-border overflow-hidden flex items-center justify-center text-foreground font-bold text-sm shrink-0">
                            {player.photoUrl ? (
                              <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-semibold text-foreground text-sm hover:text-primary transition-colors">
                            {player.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-extrabold text-sm">
                          #{player.jerseyNumber}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground font-medium">
                        {player.birthDate ? player.birthDate.substring(0, 10) : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-3 py-1.5 text-xs font-semibold text-foreground bg-card border border-border rounded-lg shadow-sm">
                          {getTeamName(player.teamId)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${player.isActive
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${player.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {player.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(player)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Editar jugador"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(player.id, player.name)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                            title="Eliminar jugador"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPlayers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <User className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          No se encontraron futbolistas.
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Prueba ajustando los filtros o crea uno nuevo.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground">
                    Mostrando <span className="font-bold text-foreground">{startIndex + 1}</span> a{' '}
                    <span className="font-bold text-foreground">
                      {Math.min(startIndex + itemsPerPage, filteredPlayers.length)}
                    </span>{' '}
                    de <span className="font-bold text-foreground">{filteredPlayers.length}</span> resultados
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-foreground bg-card px-4 py-2 rounded-lg border border-border min-w-[60px] text-center">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <PlayerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        playerToEdit={selectedPlayer}
        defaultTeamId={selectedTeamFilter}
      />
    </div>
  );
};