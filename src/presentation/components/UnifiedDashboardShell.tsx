import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useSubscriptionStore } from '../store/subscription.store';
import { LayoutDashboard, Users, Trophy, Binoculars, HeartPulse, UserCircle, LogOut, Lock, Crown } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Inicio', icon: LayoutDashboard, isPremiumOnly: false },
  { path: '/dashboard/plantilla', label: 'Plantilla', icon: Users, isPremiumOnly: false },
  { path: '/dashboard/competicion', label: 'Competición', icon: Trophy, isPremiumOnly: false },
  { path: '/dashboard/scouting', label: 'Scouting', icon: Binoculars, isPremiumOnly: true },
  { path: '/dashboard/salud', label: 'Salud y Rendimiento', icon: HeartPulse, isPremiumOnly: true },
  { path: '/dashboard/perfil', label: 'Perfil', icon: UserCircle, isPremiumOnly: false },
];

export const UnifiedDashboardShell = () => {
  const { user, logout } = useAuthStore();
  const { isPremium, checkPremiumStatus } = useSubscriptionStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    }
  }, [checkPremiumStatus, location.pathname, user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0E14] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121820] border-r border-[#2D3748] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#2D3748]">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-3 object-contain" />
          <span className="font-bold text-lg tracking-tight">
            FÚTBOL <span className="text-[#E63946]">PULSE</span>
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isLocked = item.isPremiumOnly && !isPremium;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E63946]/10 text-[#E63946]'
                      : 'text-[#A0AEC0] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {isLocked && <Lock className="w-4 h-4 text-[#D4AF37]" />}
                {item.isPremiumOnly && isPremium && <Crown className="w-4 h-4 text-[#D4AF37] opacity-50" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2D3748]">
          {!isPremium && (
            <div className="mb-4 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Plan Básico</span>
              </div>
              <p className="text-[10px] text-[#A0AEC0] mb-3 leading-relaxed">Sube a Premium Pro para gestionar plantillas ilimitadas y salud deportiva.</p>
              <button 
                onClick={() => navigate('/pro')}
                className="w-full bg-[#D4AF37] text-black text-xs font-bold py-2 rounded-lg hover:bg-[#F3CE56] transition-colors"
              >
                MEJORAR PLAN
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#2D3748] flex items-center justify-center overflow-hidden shrink-0">
              <span className="text-white font-bold text-sm uppercase">{user?.nombre_completo?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.nombre_completo || 'Usuario'}</p>
              <p className="text-xs text-[#E63946] font-bold uppercase tracking-wider truncate">{user?.tipo_usuario || 'Guest'}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-[#A0AEC0] hover:text-[#E63946] transition-colors rounded-lg hover:bg-[#E63946]/10">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center px-8 border-b border-[#2D3748] bg-[#121820]/50 backdrop-blur-md">
          {user?.tipo_usuario === 'Player' && (
            <NavLink
              to="/jugador"
              className="text-xs font-bold text-[#A0AEC0] bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:text-white hover:bg-white/10 transition-all cursor-pointer mr-4"
            >
              ← Volver a Dashboard Básico
            </NavLink>
          )}
          {/* Dashboard Header Space for Dropdowns (Organization Selector will go here) */}
          <div id="shell-header-actions" className="ml-auto flex items-center gap-4"></div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
