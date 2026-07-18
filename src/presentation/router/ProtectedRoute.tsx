import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const location = useLocation();

  if (isLoading || !hasHydrated) {
    return <div>Cargando sesión...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const path = location.pathname;

  // Validación de Rol e inicio de ruta
  if (path.startsWith('/admin') && !user.is_staff) {
    if (user.tipo_usuario === 'Player') return <Navigate to="/jugador" replace />;
    if (user.tipo_usuario === 'Coach') return <Navigate to="/coach" replace />;
    if (user.tipo_usuario === 'Scout') return <Navigate to="/scout" replace />;
    return <Navigate to="/" replace />;
  }

  if (path.startsWith('/jugador') && user.tipo_usuario !== 'Player') {
    if (user.is_staff) return <Navigate to="/admin" replace />;
    if (user.tipo_usuario === 'Coach') return <Navigate to="/coach" replace />;
    if (user.tipo_usuario === 'Scout') return <Navigate to="/scout" replace />;
    return <Navigate to="/" replace />;
  }

  if (path.startsWith('/coach') && user.tipo_usuario !== 'Coach') {
    if (user.is_staff) return <Navigate to="/admin" replace />;
    if (user.tipo_usuario === 'Player') return <Navigate to="/jugador" replace />;
    if (user.tipo_usuario === 'Scout') return <Navigate to="/scout" replace />;
    return <Navigate to="/" replace />;
  }

  if (path.startsWith('/scout') && user.tipo_usuario !== 'Scout') {
    if (user.is_staff) return <Navigate to="/admin" replace />;
    if (user.tipo_usuario === 'Player') return <Navigate to="/jugador" replace />;
    if (user.tipo_usuario === 'Coach') return <Navigate to="/coach" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
