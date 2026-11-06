import { Navigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          gap: '16px',
          color: '#059669',
        }}
      >
        <Icon icon="lucide:loader-2" width={36} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
          Verifying student session…
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

