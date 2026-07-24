import { useSubscriptionStore } from '../../store/subscription.store';
import { Crown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UnifiedDashboardPage = () => {
  const { isPremium } = useSubscriptionStore();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#2D3748] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-[#E63946] rounded-full" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Panel General
            </h1>
          </div>
          <p className="text-[#A0AEC0] text-xs mt-1 font-medium pl-5">Resumen operativo de la organización.</p>
        </div>

        {isPremium && (
          <div className="flex items-center gap-2 bg-[#121820] border border-[#2D3748] px-4 py-2 rounded-xl">
            <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Organización:</span>
            <select className="bg-transparent text-white text-sm font-medium outline-none border-none">
              <option>Club Principal</option>
              <option>Filial Sub-20</option>
              <option>Femenil</option>
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Basic Stats */}
        <div className="bg-[#121820] border border-[#2D3748] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Jugadores Activos</span>
            <UsersIcon className="h-5 w-5 text-[#E63946]" />
          </div>
          <span className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>24</span>
        </div>

        <div className="bg-[#121820] border border-[#2D3748] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Próximo Partido</span>
            <CalendarIcon className="h-5 w-5 text-[#E63946]" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Sáb 15 - 18:00</span>
        </div>

        {/* Premium Only Stat */}
        {isPremium ? (
          <div className="bg-gradient-to-br from-[#121820] to-[#1a212d] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
               <Crown className="w-24 h-24 text-[#D4AF37]" />
             </div>
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Score Global (Rendimiento)</span>
                 <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>87<span className="text-2xl text-[#A0AEC0]">%</span></span>
               </div>
             </div>
          </div>
        ) : (
          <div className="bg-[#121820] border border-[#D4AF37] rounded-2xl p-6 shadow-[0_0_15px_rgba(212,175,55,0.1)] flex flex-col items-center justify-center text-center">
            <Crown className="h-8 w-8 text-[#D4AF37] mb-3" />
            <h3 className="text-[#D4AF37] font-black text-lg tracking-tight uppercase">Métricas Avanzadas</h3>
            <p className="text-[10px] text-[#A0AEC0] mt-2 mb-4 leading-relaxed px-4">Mejora a Premium para calcular el Score Global de Rendimiento de tu equipo.</p>
            <Link to="/pro" className="bg-[#D4AF37] text-black px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F3CE56] transition-colors">
              Hacerse Premium
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

function UsersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
