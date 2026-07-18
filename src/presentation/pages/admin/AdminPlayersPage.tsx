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
  Users
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import type { Player } from '../../../domain/entities/player.entity';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { useAuthStore } from '../../store/auth.store';
import { PlayerDialog } from '../../components/admin/PlayerDialog';
import { matchesCoach } from '../../utils/name.utils';

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
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Plantilla de Jugadores
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestión de la plantilla del equipo
            </p>
          </div>
          <Button
            variant="action"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Jugador
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-md px-4 py-3">
            <div className="text-2xl font-semibold text-foreground">{displayedPlayers.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total</div>
          </div>
          <div className="bg-card border border-border rounded-md px-4 py-3">
            <div className="text-2xl font-semibold text-emerald-600">{activeCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Activos</div>
          </div>
          <div className="bg-card border border-border rounded-md px-4 py-3">
            <div className="text-2xl font-semibold text-muted-foreground">{inactiveCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Inactivos</div>
          </div>
          <div className="bg-card border border-border rounded-md px-4 py-3">
            <div className="text-2xl font-semibold text-foreground">{coachTeams.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Equipos</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar jugador..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">Todos los equipos</option>
                {coachTeams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Jugador</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Dorsal</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Fecha Nac.</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipo</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Loader2 className="animate-spin h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Cargando jugadores...</p>
                    </td>
                  </tr>
                ) : paginatedPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No se encontraron jugadores</p>
                    </td>
                  </tr>
                ) : (
                  paginatedPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-muted/50 border border-border flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {player.photoUrl ? (
                              <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover rounded-md" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                          <span className="font-medium text-sm text-foreground">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono text-muted-foreground">#{player.jerseyNumber}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="text-sm text-foreground">
                          {player.birthDate ? new Date(player.birthDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">{getTeamName(player.teamId)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md ${player.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-muted/50 text-muted-foreground border border-border'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${player.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                          {player.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(player)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(player.id, player.name)}
                            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPlayers.length)} de {filteredPlayers.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-border hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-foreground px-3 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-border hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
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