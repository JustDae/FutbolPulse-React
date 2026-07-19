import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { cn } from '../utils/cn';

export function ScoutShell() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user || user.tipo_usuario !== 'Scout') {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/scout' },
    { name: 'Jugadores', href: '/scout/jugadores' },
    { name: 'Prospectos', href: '/scout/prospectos' },
    { name: 'Reportes', href: '/scout/reportes' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      {}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <aside className="w-72 relative z-10 flex-col border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-xl hidden md:flex">
        <div className="p-8 border-b border-slate-800/60">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Pro Access</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Portal Scout
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            {user.username}
          </p>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group relative flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300',
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                )}
              >
                <span className={cn('relative z-10 font-bold tracking-wide', isActive ? 'text-emerald-400' : '')}>
                  {item.name}
                </span>
                {isActive && (
                  <span className="relative z-10 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                {!isActive && (
                   <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-500 font-bold -translate-x-2 group-hover:translate-x-0">
                     →
                   </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800/60">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-lg">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Rendimiento</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-black text-white">Top 5%</p>
              <p className="text-xs text-emerald-400 font-bold">+12% mes</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="p-8 md:p-12 max-w-7xl mx-auto h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
