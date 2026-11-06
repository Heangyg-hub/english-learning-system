import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import EducationDegreeIcon from './EducationDegreeIcon';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isProfilePage = location.pathname === '/profile';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const userInitials =
    user?.username?.slice(0, 2)?.toUpperCase() ||
    user?.email?.slice(0, 2)?.toUpperCase() ||
    'ST';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-navbar, #ffffff)',
        borderBottom: '1px solid var(--border-navbar, #e2e8f0)',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.03))',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
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
          <EducationDegreeIcon size={36} />
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: '17px',
                color: 'var(--heading, #0f172a)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              ELS Student
            </div>
          </div>
        </Link>

        {/* Right Actions */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} ref={dropdownRef}>
            {/* Notification Button */}
            <button
              type="button"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
              title="Notifications"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border, #e2e8f0)',
                backgroundColor: 'var(--bg-card, #ffffff)',
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
              onClick={() => navigate('/profile')}
              aria-label="Student Pass"
              title="Student Pass"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border, #e2e8f0)',
                backgroundColor: 'var(--bg-card, #ffffff)',
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

            {/* Profile Avatar Button (Clicking navigates to Profile page) */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              aria-label="Student Profile"
              title={user?.username ? `${user.username} (View Profile)` : 'Student Profile'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                padding: '2px',
                border: '2px solid transparent',
                background: 'linear-gradient(135deg, #10b981, #059669) border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                transition: 'transform 0.16s ease, box-shadow 0.16s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
              }}
            >
              <img
                src={user?.avatar || '/founder/Young Sengheang.jpg'}
                alt={user?.username || 'Student'}
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
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {userInitials}
              </div>
            </button>
          </div>
        ) : (
          /* Unauthenticated State */
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '12px',
                backgroundColor: '#059669',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon icon="lucide:log-in" width={16} />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
