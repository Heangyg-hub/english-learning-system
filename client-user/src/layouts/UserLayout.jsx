import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function UserLayout() {
  const location = useLocation();
  const isProfile = location.pathname === '/profile';
  const isNotifications = location.pathname === '/notifications';
  const isCenteredPage = isProfile || isNotifications;

  return (
    <div
      className="app-user-layout"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page, #f0fbf5)',
        color: 'var(--text-primary, #0f172a)',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      <Navbar />
      <main style={{ flex: 1, padding: isCenteredPage ? '16px 1rem 48px' : '20px 0 64px' }}>
        <Outlet />
      </main>
    </div>
  );
}
