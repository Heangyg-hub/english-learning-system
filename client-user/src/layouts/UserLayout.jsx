import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function UserLayout() {
  const location = useLocation();
  const isProfile = location.pathname === '/profile';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f0fbf5',
      }}
    >
      <Navbar />
      <main style={{ flex: 1, padding: isProfile ? '12px 0 48px' : '20px 0 64px' }}>
        <Outlet />
      </main>
      {!isProfile && <Footer />}
    </div>
  );
}
