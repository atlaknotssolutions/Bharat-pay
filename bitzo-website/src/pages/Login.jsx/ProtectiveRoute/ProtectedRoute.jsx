import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const location = useLocation();

  // 🔐 simple auth check (baad me real auth se replace karna)
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  // example: localStorage.setItem('token', 'abc123')

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
