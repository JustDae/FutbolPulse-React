import { useEffect, useState } from 'react';
import { PremiumGate } from '../../components/PremiumGate';
import { usePlayerStore } from '../../store/player.store';
import { Search, Loader2, Users, FileText, Activity } from 'lucide-react';

export const UnifiedScoutingPage = () => {
  const { players, fetchPlayers, isLoading } = usePlayerStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#2D3748] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Scouting & Análisis
            </h1>
          </div>
          <p className="text-[#A0AEC0] text-xs mt-1 font-medium pl-5">Descubrimiento de talento y seguimiento de prospectos.</p>
        </div>
      </div>

      <PremiumGate featureName="Red de Scouting Avanzada">
        <div className="bg-[#121820] rounded-xl border border-[#2D3748] shadow-xl overflow-hidden">
          
          <div className="p-4 border-b border-[#2D3748] bg-[#0A0E14]/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0AEC0]" />
              <input
                type="text"
                placeholder="Buscar prospecto por nombre o posición..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0B1220] border border-[#2D3748] rounded-xl text-white placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#E63946] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Mostrando:</span>
              <span className="bg-[#0B1220] px-3 py-1.5 rounded-lg border border-[#2D3748] text-white text-xs font-bold tabular-nums">
                {filteredPlayers.length}
              </span>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-[#E63946] mb-4" />
                <p className="text-[#A0AEC0] text-xs font-bold uppercase tracking-wider">Cargando base de datos...</p>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#A0AEC0]">
                <Users className="h-12 w-12 opacity-20 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider">No se encontraron prospectos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.map(player => (
                  <div key={player.id} className="bg-[#0A0E14] border border-[#2D3748] rounded-xl overflow-hidden hover:border-[#E63946]/50 transition-colors group">
                    <div className="aspect-[4/3] bg-[#0B1220] flex items-center justify-center relative overflow-hidden border-b border-[#2D3748]">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Users className="w-12 h-12 text-[#2D3748]" />
                      )}
                      
                      <div className="absolute top-2 right-2 bg-[#E63946] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                        #{player.jerseyNumber}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm truncate">{player.name}</h3>
                      <p className="text-xs text-[#A0AEC0] mb-4">{player.position || 'Posición no definida'}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#2D3748] hover:bg-[#3f4a5c] transition-colors rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                          <FileText className="w-3 h-3" /> Reporte
                        </button>
                        <button className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#0B1220] border border-[#2D3748] hover:border-[#E63946] transition-colors rounded-lg text-[#E63946] text-[10px] font-bold uppercase tracking-wider">
                          <Activity className="w-3 h-3" /> Stats
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PremiumGate>
    </div>
  );
};
