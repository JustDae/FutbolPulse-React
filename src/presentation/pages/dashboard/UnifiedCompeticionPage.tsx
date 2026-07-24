import { useEffect, useState } from 'react';
import { useSubscriptionStore } from '../../store/subscription.store';
import { PremiumGate } from '../../components/PremiumGate';
import { LiveMatchTrackerPage } from '../coach/LiveMatchTrackerPage';
import { PostMatchEvaluationPage } from '../coach/PostMatchEvaluationPage';
import { matchRepository } from '../../../infrastructure/adapters/axios-match.repository';
import type { Match } from '../../../domain/entities/match.entity';
import { Trophy, CheckCircle, Clock } from 'lucide-react';

export const UnifiedCompeticionPage = () => {
  const { isPremium } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState<'lista' | 'live' | 'evaluaciones'>('lista');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    matchRepository.getMatches().then((data) => {
      setMatches(data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#2D3748] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Competición
            </h1>
          </div>
          <p className="text-[#A0AEC0] text-xs mt-1 font-medium pl-5">Gestión de partidos y seguimiento de la temporada.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-[#2D3748] pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('lista')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors shrink-0 ${
            activeTab === 'lista' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Lista de Partidos
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'live' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Live Tracking
          {!isPremium && <span className="text-[#D4AF37] text-xs px-1">🔒</span>}
        </button>
        <button
          onClick={() => setActiveTab('evaluaciones')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wide rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'evaluaciones' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Evaluaciones Post-Partido
          {!isPremium && <span className="text-[#D4AF37] text-xs px-1">🔒</span>}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'lista' && (
          <div className="bg-[#121820] rounded-xl border border-[#2D3748] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#2D3748] bg-[#1C2B45]/40 text-[10px] font-extrabold uppercase tracking-widest text-[#A0AEC0]">
                  <tr>
                    <th className="py-4 px-6">Fecha</th>
                    <th className="py-4 px-6">Local</th>
                    <th className="py-4 px-6 text-center">Resultado</th>
                    <th className="py-4 px-6">Visitante</th>
                    <th className="py-4 px-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3748]/50 text-xs text-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-[#A0AEC0]">Cargando partidos...</td>
                    </tr>
                  ) : matches.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-[#A0AEC0]">
                        <Trophy className="h-12 w-12 opacity-20 mx-auto mb-3" />
                        <p className="font-bold uppercase tracking-widest">No hay partidos registrados</p>
                      </td>
                    </tr>
                  ) : (
                    matches.map(m => (
                      <tr key={m.id} className="hover:bg-[#1C2B45]/30 transition-colors">
                        <td className="py-4 px-6 text-[#A0AEC0] font-medium">
                          {new Date(m.matchDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-4 px-6 font-bold">{m.equipoLocal}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="bg-[#0B1220] border border-[#2D3748] px-3 py-1 rounded-lg font-mono font-bold text-[#E63946]">
                            {m.homeScore ?? '-'} : {m.awayScore ?? '-'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold">{m.equipoVisitante}</td>
                        <td className="py-4 px-6">
                          {m.status === 'Finalizado' ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                              <CheckCircle className="w-3 h-3" /> Finalizado
                            </span>
                          ) : m.status === 'En curso' ? (
                            <span className="flex items-center gap-1.5 text-[#E63946] text-[10px] font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-ping" /> En Vivo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                              <Clock className="w-3 h-3" /> Programado
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <PremiumGate featureName="Live Match Tracking y Estadísticas en Tiempo Real">
            <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
              <LiveMatchTrackerPage />
            </div>
          </PremiumGate>
        )}

        {activeTab === 'evaluaciones' && (
          <PremiumGate featureName="Evaluación Post-Partido por Jugador">
            <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
              <PostMatchEvaluationPage />
            </div>
          </PremiumGate>
        )}
      </div>
    </div>
  );
};
