import { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  Users,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';
import { matchesCoach } from '../../../presentation/utils/name.utils';

export const AdminPlayersPage = () => {
  const { players, isLoading, fetchPlayers, deletePlayer } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();
  const { user } = useAuthStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
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

  const statusFilteredPlayers = filterStatus === 'all'
    ? teamFilteredPlayers
    : teamFilteredPlayers.filter(p => filterStatus === 'active' ? p.isActive : !p.isActive);

  const filteredPlayers = statusFilteredPlayers.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (`#${p.jerseyNumber}`).includes(searchTerm) ||
    getTeamName(p.teamId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeamFilter, filterStatus]);

  const activeCount = displayedPlayers.filter(p => p.isActive).length;
  const inactiveCount = displayedPlayers.filter(p => !p.isActive).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 p-4 md:p-6 max-w-8xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Users className="h-6 w-6 text-foreground/70" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    Plantilla de Jugadores
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{new Date().toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-6 bg-muted/30 px-4 py-3 rounded-lg border border-border">
                <div className="text-center">
                  <span className="block text-xl font-bold text-emerald-600">{activeCount}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Activos</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <span className="block text-xl font-bold text-muted-foreground/60">{inactiveCount}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Inactivos</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <span className="block text-xl font-bold text-foreground">{displayedPlayers.length}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</span>
                </div>
              </div>

              <Button
                variant="action"
                onClick={handleOpenCreate}
                className="rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Jugador
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 bg-muted/10 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, dorsal o equipo..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedTeamFilter}
                  onChange={(e) => setSelectedTeamFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-w-[140px]"
                >
                  <option value="">Todos los equipos</option>
                  {coachTeams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="py-4 px-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Futbolista</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Dorsal</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Fecha Nac.</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Equipo</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Estado</th>
                  <th className="py-4 px-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Cargando jugadores...
                      </p>
                    </td>
                  </tr>
                ) : paginatedPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-base font-bold text-foreground">
                          No se encontraron jugadores
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ajusta los filtros para encontrar más resultados
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedTeamFilter('');
                            setFilterStatus('all');
                          }}
                          className="mt-4 rounded-lg"
                        >
                          Limpiar filtros
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-muted/30 transition-colors duration-100 group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-border bg-muted/30 flex items-center justify-center text-sm font-bold shrink-0 text-muted-foreground">
                            {player.photoUrl ? (
                              <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover rounded-lg" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground">
                              {player.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-extrabold text-sm bg-muted/20 text-muted-foreground border border-border/30">
                          #{player.jerseyNumber}
                        </div>
                      </td>
                      <td className="py-4 px-5 hidden lg:table-cell">
                        <div className="text-sm text-foreground font-medium">
                          {player.birthDate ? new Date(player.birthDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </div>
                        {player.birthDate && (
                          <div className="text-[10px] text-muted-foreground">
                            {Math.floor((new Date().getTime() - new Date(player.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} años
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-card text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                          {getTeamName(player.teamId)}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${player.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-muted/30 text-muted-foreground border-border'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${player.isActive ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                          {player.isActive ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(player)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all"
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">Mostrando</span>
                  <span className="font-bold text-foreground">{startIndex + 1}</span>
                  <span>-</span>
                  <span className="font-bold text-foreground">
                    {Math.min(startIndex + itemsPerPage, filteredPlayers.length)}
                  </span>
                  <span>de</span>
                  <span className="font-bold text-foreground">{filteredPlayers.length}</span>
                  <span>jugadores</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card border border-border text-muted-foreground hover:bg-muted/50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{activeCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Jugadores Activos</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <XCircle className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{inactiveCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Jugadores Inactivos</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{coachTeams.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Equipos Asignados</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Activity className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {displayedPlayers.length > 0 ? Math.round((activeCount / displayedPlayers.length) * 100) : 0}%
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tasa de Actividad</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlayerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        playerToEdit={selectedPlayer}
        defaultTeamId={selectedTeamFilter}
      />
    </div>
  );
};