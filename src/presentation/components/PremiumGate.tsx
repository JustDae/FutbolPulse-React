import { useSubscriptionStore } from '../store/subscription.store';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumGateProps {
  children: React.ReactNode;
  featureName: string;
}

export const PremiumGate = ({ children, featureName }: PremiumGateProps) => {
  const { isPremium } = useSubscriptionStore();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-[#121820] border border-[#D4AF37] rounded-3xl text-center shadow-lg">
      <Lock className="w-12 h-12 text-[#D4AF37] mb-4" />
      <h2 className="text-[#D4AF37] font-black text-xl tracking-tight">FUNCIÓN PREMIUM</h2>
      <p className="text-[#A0AEC0] text-sm my-4 max-w-sm">
        Mejora tu plan para acceder a <span className="font-bold text-white">{featureName}</span> y llevar a tu club al siguiente nivel.
      </p>
      <Link 
        to="/pro"
        className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#F3CE56] transition-colors"
      >
        VER PLANES
      </Link>
    </div>
  );
};
