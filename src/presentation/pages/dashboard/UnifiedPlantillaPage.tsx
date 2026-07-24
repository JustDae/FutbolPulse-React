import { useState } from 'react';
import { useSubscriptionStore } from '../../store/subscription.store';
import { PremiumGate } from '../../components/PremiumGate';
import { AdminPlayersPage } from '../admin/AdminPlayersPage';
import { LineupBuilderPage } from '../coach/LineupBuilderPage';

export const UnifiedPlantillaPage = () => {
  const { isPremium } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState<'lista' | 'alineaciones'>('lista');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-[#2D3748] pb-4">
        <button
          onClick={() => setActiveTab('lista')}
          className={`px-4 py-2 font-bold text-sm tracking-wide rounded-t-xl transition-colors ${
            activeTab === 'lista' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Lista de Jugadores
        </button>
        <button
          onClick={() => setActiveTab('alineaciones')}
          className={`px-4 py-2 font-bold text-sm tracking-wide rounded-t-xl transition-colors flex items-center gap-2 ${
            activeTab === 'alineaciones' ? 'bg-[#E63946] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Alineaciones (Pizarra)
          {!isPremium && <span className="text-[#D4AF37] text-xs px-1">🔒</span>}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'lista' ? (
          <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
            {/* Reusing AdminPlayersPage but hiding its own wrapper if needed, or just rendering it. 
                Since AdminPlayersPage might have its own header, we can just render it here for now. */}
            <AdminPlayersPage />
          </div>
        ) : (
          <PremiumGate featureName="Pizarra Táctica de Alineaciones">
            <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
              <LineupBuilderPage />
            </div>
          </PremiumGate>
        )}
      </div>
    </div>
  );
};
