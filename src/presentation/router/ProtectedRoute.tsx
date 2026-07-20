import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const ProtectedRoute = () => {
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

  return <Outlet />;
};
