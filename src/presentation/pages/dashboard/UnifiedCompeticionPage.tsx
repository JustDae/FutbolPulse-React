import { useState } from 'react';
import { useSubscriptionStore } from '../../store/subscription.store';
import { PremiumGate } from '../../components/PremiumGate';
import { MatchManagementPage } from '../coach/MatchManagementPage';
import { LiveMatchTrackerPage } from '../coach/LiveMatchTrackerPage';
import { PostMatchEvaluationPage } from '../coach/PostMatchEvaluationPage';

export const UnifiedCompeticionPage = () => {
  const { isPremium } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState<'lista' | 'live' | 'evaluaciones'>('lista');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-[#2D3748] pb-4">
        <button
          onClick={() => setActiveTab('lista')}
          className={`px-4 py-2 font-bold text-sm tracking-wide rounded-t-xl transition-colors ${
            activeTab === 'lista' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Lista de Partidos
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 font-bold text-sm tracking-wide rounded-t-xl transition-colors flex items-center gap-2 ${
            activeTab === 'live' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Rastreo en Vivo & Timeline
          {!isPremium && <span className="text-[#D4AF37] text-xs px-1">🔒</span>}
        </button>
        <button
          onClick={() => setActiveTab('evaluaciones')}
          className={`px-4 py-2 font-bold text-sm tracking-wide rounded-t-xl transition-colors flex items-center gap-2 ${
            activeTab === 'evaluaciones' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Evaluaciones Post-Partido
          {!isPremium && <span className="text-[#D4AF37] text-xs px-1">🔒</span>}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'lista' && (
          <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
            <MatchManagementPage />
          </div>
        )}
        
        {activeTab === 'live' && (
          <PremiumGate featureName="Rastreo en Vivo y Cronología">
            <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
              <LiveMatchTrackerPage />
            </div>
          </PremiumGate>
        )}

        {activeTab === 'evaluaciones' && (
          <PremiumGate featureName="Evaluaciones Técnicas Post-Partido">
            <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
              <PostMatchEvaluationPage />
            </div>
          </PremiumGate>
        )}
      </div>
    </div>
  );
};
