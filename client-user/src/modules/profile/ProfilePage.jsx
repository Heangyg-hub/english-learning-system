import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './styles/profile-page.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'km' ? 'en' : 'km');
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

  const initials = user?.username
    ?.slice(0, 2)
    ?.toUpperCase() || 'YS';

  return (
    <div className="profile-page-container">
      {/* ── User Overview Hero Card ── */}
      <section
        className="profile-hero-card"
        role="button"
        tabIndex={0}
        title="Student Profile"
      >
        <div className="profile-hero-avatar-wrap">
          <img
            src="/founder/Young Sengheang.jpg"
            alt={user?.username || 'Student Avatar'}
            className="profile-hero-avatar-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="profile-hero-avatar-fallback" style={{ display: 'none' }}>
            {initials}
          </div>
          <span className="profile-hero-edit-badge" title="Edit avatar">
            <Icon icon="lucide:pencil" width={11} height={11} />
          </span>
        </div>

        <div className="profile-hero-meta">
          <div className="profile-hero-name-row">
            <h2 className="profile-hero-name">
              {user?.username ? user.username.toUpperCase() : 'YOUNG SENGHEANG'}
            </h2>
            <span className="profile-hero-sub-badge">
              {user?.role === 'admin' ? 'Admin' : '余盛兴'}
            </span>
          </div>

          <div className="profile-hero-badges-row">
            <span className="profile-hero-role-pill">
              <Icon icon="lucide:shield-check" width={13} />
              <span>{user?.role === 'admin' ? 'Administrator' : 'Student'}</span>
            </span>
          </div>
        </div>

        <div className="profile-hero-arrow" aria-hidden="true">
          <Icon icon="lucide:chevron-right" width={20} />
        </div>
      </section>

      {/* ── Grouped Settings Card (Matching Image 2) ── */}
      <div className="profile-settings-group-card">
        {/* 1. Language Row */}
        <div className="profile-setting-row" onClick={toggleLanguage}>
          <div className="profile-setting-left">
            <div className="profile-setting-icon-box icon-box--blue">
              <Icon icon="lucide:globe" width={20} />
            </div>
            <div className="profile-setting-text">
              <span className="profile-setting-title">Language</span>
              <span className="profile-setting-subtitle">
                {currentLanguage === 'km' ? 'ភាសាខ្មែរ → English (EN)' : '中文 → English (EN)'}
              </span>
            </div>
          </div>
          <div className="profile-setting-right">
            <Icon icon="lucide:chevron-right" width={18} className="profile-chevron" />
          </div>
        </div>

        <div className="profile-setting-divider" />

        {/* 2. Feedback Row */}
        <div
          className="profile-setting-row"
          onClick={() => alert('Student feedback submitted. Thank you for helping us improve English Learning System!')}
        >
          <div className="profile-setting-left">
            <div className="profile-setting-icon-box icon-box--green">
              <Icon icon="lucide:headset" width={20} />
            </div>
            <div className="profile-setting-text">
              <span className="profile-setting-title">Feedback</span>
            </div>
          </div>
          <div className="profile-setting-right">
            <Icon icon="lucide:chevron-right" width={18} className="profile-chevron" />
          </div>
        </div>

        <div className="profile-setting-divider" />

        {/* 3. Scan QR Code Row */}
        <div
          className="profile-setting-row"
          onClick={() => alert('Live Camera QR Scanner feature ready for classroom check-in!')}
        >
          <div className="profile-setting-left">
            <div className="profile-setting-icon-box icon-box--lime">
              <Icon icon="lucide:scan-line" width={20} />
            </div>
            <div className="profile-setting-text">
              <span className="profile-setting-title">Scan QR Code</span>
              <span className="profile-setting-subtitle">Live Camera Scan</span>
            </div>
          </div>
          <div className="profile-setting-right">
            <Icon icon="lucide:chevron-right" width={18} className="profile-chevron" />
          </div>
        </div>

        <div className="profile-setting-divider" />

        {/* 4. Icon Theme Row */}
        <div className="profile-setting-row">
          <div className="profile-setting-left">
            <div className="profile-setting-icon-box icon-box--purple">
              <Icon icon="lucide:palette" width={20} />
            </div>
            <div className="profile-setting-text">
              <span className="profile-setting-title">Icon Theme</span>
              <span className="profile-setting-subtitle">Default Icons ⚡</span>
            </div>
          </div>
          <div className="profile-setting-right">
            <span className="profile-theme-tag tag-default">Default</span>
            <Icon icon="lucide:chevron-right" width={18} className="profile-chevron" />
          </div>
        </div>

        <div className="profile-setting-divider" />

        {/* 5. Dark Mode Row */}
        <div className="profile-setting-row" onClick={toggleDarkMode}>
          <div className="profile-setting-left">
            <div className="profile-setting-icon-box icon-box--purple">
              <Icon icon="lucide:moon" width={20} />
            </div>
            <div className="profile-setting-text">
              <span className="profile-setting-title">Dark Mode</span>
            </div>
          </div>
          <div className="profile-setting-right" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`app-ios-switch ${isDarkMode ? 'is-on' : ''}`}
              onClick={toggleDarkMode}
              role="switch"
              aria-checked={isDarkMode}
              aria-label="Toggle Dark Mode"
            >
              <span className="app-ios-switch-thumb" />
            </button>
          </div>
        </div>

        <div className="profile-setting-divider" />

        {/* 6. Privacy Policy Row */}
        <div
          className="profile-setting-row"
          onClick={() => alert('English Learning System Privacy Policy: Your data and learning progress are safe and protected.')}
        >
          <div className="profile-setting-left">
            <div className="profile-setting-icon-box icon-box--royal">
              <Icon icon="lucide:shield-check" width={20} />
            </div>
            <div className="profile-setting-text">
              <span className="profile-setting-title">Privacy Policy</span>
            </div>
          </div>
          <div className="profile-setting-right">
            <Icon icon="lucide:chevron-right" width={18} className="profile-chevron" />
          </div>
        </div>
      </div>

      {/* ── Standalone Logout Card ── */}
      <div
        className="profile-logout-card"
        onClick={handleLogout}
        role="button"
        tabIndex={0}
      >
        <div className="profile-logout-content">
          <div className="profile-logout-icon-box">
            <Icon icon="lucide:log-out" width={18} />
          </div>
          <span className="profile-logout-text">Logout</span>
        </div>
      </div>

      {/* ── Version Text ── */}
      <div className="profile-version-text">
        Version 2.6.6
      </div>

      {/* ── Developer Footer Credit ── */}
      <div className="profile-developer-footer">
        <div className="profile-developer-link">
          <Icon icon="lucide:info" width={15} />
          <span>DEVELOPED BY : YOUNG SENGHEANG ©2026</span>
        </div>
      </div>
    </div>
  );
}

