import { PremiumGate } from '../../components/PremiumGate';
import { HealthManagementPage } from '../coach/HealthManagementPage';

export const UnifiedSaludPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-[#2D3748] pb-4">
        <div className="w-2 h-7 bg-[#E63946] rounded-full" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Salud y Rendimiento
        </h1>
      </div>
      
      <PremiumGate featureName="Módulo de Salud, Lesiones y Tests">
        <div className="bg-[#121820] rounded-xl p-4 border border-[#2D3748]">
          <HealthManagementPage />
        </div>
      </PremiumGate>
    </div>
  );
};
