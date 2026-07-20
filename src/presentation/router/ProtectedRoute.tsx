import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const location = useLocation();

  if (isLoading || !hasHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B1220] text-white">
        <div className="text-xs font-bold uppercase tracking-widest text-[#E31C3D] animate-pulse">
          Cargando sesión...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAdmin = user.is_staff || user.tipo_usuario === 'Admin';
    const isAllowed = allowedRoles.includes(user.tipo_usuario) || (allowedRoles.includes('Admin') && isAdmin);
    
    if (!isAllowed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1220] text-white px-4 text-center">
          <div className="bg-[#10182B] border border-[#1C2B45] p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-[#E31C3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-[#E31C3D] text-3xl font-black">!</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Usuario no autorizado
            </h1>
            <p className="text-white/50 text-sm mb-8">
              No tienes los permisos necesarios para acceder a esta sección de la plataforma.
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-[#E31C3D] hover:bg-[#c61834] text-white font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
};
