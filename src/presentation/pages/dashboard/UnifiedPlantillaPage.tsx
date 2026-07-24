import { useEffect, useState } from 'react';
import { useSubscriptionStore } from '../../store/subscription.store';
import { usePlayerStore } from '../../store/player.store';
import { useTeamStore } from '../../store/team.store';
import { PremiumGate } from '../../components/PremiumGate';
import { LineupBuilderPage } from '../coach/LineupBuilderPage';
import { PremiumPlayerDialog } from './PremiumPlayerDialog';
import { Search, Plus, User, Edit2, Loader2, Users } from 'lucide-react';
import type { Player } from '../../../domain/entities/player.entity';

export const UnifiedPlantillaPage = () => {
  const { isPremium } = useSubscriptionStore();
  const { players, fetchPlayers, isLoading } = usePlayerStore();
  const { teams, fetchTeams } = useTeamStore();

  const [activeTab, setActiveTab] = useState<'lista' | 'alineaciones'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, [fetchPlayers, fetchTeams]);

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Desconocido';
  };

  const handleOpenCreate = () => {
    setSelectedPlayer(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.jerseyNumber.toString().includes(searchTerm);
    const matchesTeam = selectedTeamFilter ? p.teamId === selectedTeamFilter : true;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#2D3748] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Plantilla
            </h1>
          </div>
          <p className="text-[#A0AEC0] text-xs mt-1 font-medium pl-5">Gestión de la plantilla oficial de jugadores.</p>
        </div>
        
        {activeTab === 'lista' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-[#E63946] hover:bg-[#c61834] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-[#E63946]/20 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Nuevo Jugador
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 border-b border-[#2D3748] pb-4">
        <button
          onClick={() => setActiveTab('lista')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors ${
            activeTab === 'lista' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Lista de Jugadores
        </button>
        <button
          onClick={() => setActiveTab('alineaciones')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors flex items-center gap-2 ${
            activeTab === 'alineaciones' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Alineaciones (Pizarra)
          {!isPremium && <span className="text-[#D4AF37] text-xs px-1">🔒</span>}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'lista' ? (
          <div className="bg-[#121820] rounded-xl border border-[#2D3748] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#2D3748] bg-[#0A0E14]/50">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0AEC0]" />
                  <input
                    type="text"
                    placeholder="Buscar jugador..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0B1220] border border-[#2D3748] rounded-xl text-white placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#E63946] transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedTeamFilter}
                  onChange={(e) => setSelectedTeamFilter(e.target.value)}
                  className="w-full md:w-auto px-4 py-2.5 text-xs bg-[#0B1220] border border-[#2D3748] rounded-xl text-white focus:outline-none focus:border-[#E63946] transition-all"
                >
                  <option value="">Todos los equipos</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#2D3748] bg-[#1C2B45]/40 text-[10px] font-extrabold uppercase tracking-widest text-[#A0AEC0]">
                  <tr>
                    <th className="py-4 px-6">Jugador</th>
                    <th className="py-4 px-6">Dorsal</th>
                    <th className="py-4 px-6">Equipo</th>
                    <th className="py-4 px-6 text-right">Ficha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3748]/50 text-xs text-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <Loader2 className="animate-spin h-8 w-8 text-[#E63946] mx-auto mb-3" />
                        <p className="text-[#A0AEC0] font-bold uppercase tracking-widest">Cargando...</p>
                      </td>
                    </tr>
                  ) : filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-[#A0AEC0]">
                        <Users className="h-12 w-12 opacity-20 mx-auto mb-3" />
                        <p className="font-bold uppercase tracking-widest">No se encontraron jugadores</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPlayers.map((player) => (
                      <tr key={player.id} className="hover:bg-[#1C2B45]/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#0B1220] border border-[#2D3748] flex items-center justify-center text-xs font-bold text-[#E63946] overflow-hidden shrink-0 shadow-inner">
                              {player.photoUrl ? (
                                <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <span className="font-bold text-sm">{player.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-[#E63946] bg-[#E63946]/10 px-2.5 py-1 rounded-lg border border-[#E63946]/20">
                            #{player.jerseyNumber}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium">
                          {getTeamName(player.teamId)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenEdit(player)}
                            className="px-3 py-1.5 bg-[#2D3748] hover:bg-[#3f4a5c] text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ml-auto cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" /> Ver Ficha
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <PremiumGate featureName="Pizarra Táctica de Alineaciones">
            <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
              <LineupBuilderPage />
            </div>
          </PremiumGate>
        )}
      </div>

      <PremiumPlayerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        playerToEdit={selectedPlayer}
      />
    </div>
  );
};
