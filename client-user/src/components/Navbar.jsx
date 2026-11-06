import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfilePage = location.pathname === '/profile';

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      if (!isProfilePage) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '66px',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
          title={isProfilePage ? 'Back to Home' : 'ELS Student'}
        >
          <img
            src="/Logo/logo-cls-system-default.png"
            alt="ELS Logo"
            style={{
              height: '36px',
              width: 'auto',
              maxWidth: '52px',
              objectFit: 'contain',
              display: 'block',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }
            }}
          />
          <div
            style={{
              display: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Icon icon="lucide:languages" width={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              ELS Student
            </div>
          </div>
        </Link>

        {/* Right Actions: Notifications, ID Pass & Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Notification Button */}
          <button
            type="button"
            onClick={() => alert('No new notifications')}
            aria-label="Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#3b82f6',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Icon icon="lucide:bell" width={18} />
          </button>

          {/* Student Pass Button */}
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                navigate('/profile');
              } else {
                navigate('/login');
              }
            }}
            aria-label="Student Pass"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Icon icon="lucide:id-card" width={18} />
          </button>

          {/* Profile Avatar Button */}
          <button
            type="button"
            onClick={handleAvatarClick}
            aria-label="Profile"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: '2px',
              border: '2px solid transparent',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444, #3b82f6) border-box',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
          >
            <img
              src="/founder/Young Sengheang.jpg"
              alt="User"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
            <div
              style={{
                display: 'none',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
