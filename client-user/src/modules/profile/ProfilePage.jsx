import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBiometrics } from '../../context/BiometricContext';
import { useTheme } from '../../context/ThemeContext';
import EducationDegreeIcon from '../../components/EducationDegreeIcon';
import { CambodiaFlag, UKFlag } from '../../components/icons/FlagIcons';
import './styles/profile-page.css';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const {
    isStandalone,
    isEnabled: isBiometricEnabled,
    setIsEnabled: setIsBiometricEnabled,
    lockTimeout,
    setLockTimeout,
    onlyWhenInstalled,
    setOnlyWhenInstalled,
    manualLock,
    authenticateBiometrics,
    passcode,
    changePasscode,
    biometricsEnabled,
    setBiometricsEnabled,
  } = useBiometrics();

  const [showPinChange, setShowPinChange] = useState(false);
  const [pinOld, setPinOld] = useState('');
  const [pinNew, setPinNew] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinMsg, setPinMsg] = useState({ text: '', isError: false });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef(null);

  // Sub-view: 'main' | 'language'
  const currentView = searchParams.get('tab') === 'language' ? 'language' : 'main';

  const setView = (v) => {
    if (v === 'language') {
      setSearchParams({ tab: 'language' });
    } else {
      setSearchParams({});
    }
  };

  // State
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeModal, setActiveModal] = useState(null); // 'avatar' | 'pass' | 'feedback' | 'privacy' | 'theme' | 'biometric' | null
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Avatar Management
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || '/founder/Young Sengheang.jpg'
  );
  const [avatarSaving, setAvatarSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        const width = img.width;
        const height = img.height;
        const minDim = Math.min(width, height);
        const sx = (width - minDim) / 2;
        const sy = (height - minDim) / 2;

        canvas.width = maxDim;
        canvas.height = maxDim;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxDim, maxDim);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setSelectedAvatar(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    setAvatarSaving(true);
    try {
      await updateProfile({ avatar: selectedAvatar });
      setActiveModal(null);
    } catch (err) {
      console.error('Failed to update avatar:', err);
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  const handleLanguageSelect = (langKey) => {
    setLanguage(langKey);
  };

  const toggleDarkMode = () => {
    toggleTheme();
  };

  const displayName = user?.name || user?.username || 'YOUNG SENGHEANG';
  const displayEmail = user?.email || 'sengheang@els.com';
  const studentId = user?._id ? `ELS-${user._id.slice(-6).toUpperCase()}` : 'ELS-2026-STU';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'YS';

  return (
    <div className="profile-page-container">
      {/* ═══════════════════════════════════════════════════════════════
          A. LANGUAGE SELECTION SCREEN (Matching Image 1 & 2)
         ═══════════════════════════════════════════════════════════════ */}
      {currentView === 'language' ? (
        <div className="profile-subview-container">
          {/* Top Header Row with < Settings back button */}
          <div className="profile-subview-nav">
            <button
              type="button"
              className="profile-subview-back-btn"
              onClick={() => setView('main')}
              aria-label="Back to Settings"
            >
              <Icon icon="lucide:chevron-left" width={22} />
              <span>Settings</span>
            </button>
            <h1 className="profile-subview-title">Language</h1>
            <div className="profile-subview-nav-spacer" />
          </div>

          {/* Language Options Card */}
          <div className="language-selector-card">
            {/* Option 1: ភាសាខ្មែរ (KH) */}
            <div
              className={`language-option-row ${language === 'km' ? 'is-selected' : ''}`}
              onClick={() => handleLanguageSelect('km')}
              role="button"
              tabIndex={0}
              aria-pressed={language === 'km'}
            >
              <div className="language-option-left">
                <CambodiaFlag size={44} />
                <div className="language-option-text">
                  <div className="language-option-title-row">
                    <span className="language-name-title">ភាសាខ្មែរ</span>
                    <span className="language-code-badge badge-kh">KH</span>
                  </div>
                  <span className="language-option-desc">English → ភាសាខ្មែរ (KH)</span>
                </div>
              </div>
              <div className="language-option-radio">
                {language === 'km' ? (
                  <div className="language-radio-checked" title="Active">
                    <Icon icon="lucide:check" width={16} color="#ffffff" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="language-radio-unchecked" />
                )}
              </div>
            </div>

            {/* Option 2: English (EN) */}
            <div
              className={`language-option-row ${language === 'en' ? 'is-selected' : ''}`}
              onClick={() => handleLanguageSelect('en')}
              role="button"
              tabIndex={0}
              aria-pressed={language === 'en'}
            >
              <div className="language-option-left">
                <UKFlag size={44} />
                <div className="language-option-text">
                  <div className="language-option-title-row">
                    <span className="language-name-title">English</span>
                    <span className="language-code-badge badge-en">EN</span>
                  </div>
                  <span className="language-option-desc">Khmer → English (EN)</span>
                </div>
              </div>
              <div className="language-option-radio">
                {language === 'en' ? (
                  <div className="language-radio-checked" title="Active">
                    <Icon icon="lucide:check" width={16} color="#ffffff" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="language-radio-unchecked" />
                )}
              </div>
            </div>

            {/* Bottom Footnote Note */}
            <div className="language-selector-footnote">
              <Icon icon="lucide:info" width={16} className="language-footnote-icon" />
              <span>Applies across all lessons, vocab, and quizzes.</span>
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════
            B. MAIN SETTINGS & PROFILE VIEW (Matching Image 2)
           ═══════════════════════════════════════════════════════════════ */
        <>
          {/* ── 1. User Overview Hero Card ── */}
          <section
            className="profile-hero-card"
            onClick={() => setActiveModal('pass')}
            role="button"
            tabIndex={0}
            title="View Student ID Pass"
          >
            <div
              className="profile-hero-avatar-wrap"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAvatar(user?.avatar || '/founder/Young Sengheang.jpg');
                setActiveModal('avatar');
              }}
              title="Click to Change Profile Photo"
            >
              <img
                src={user?.avatar || '/founder/Young Sengheang.jpg'}
                alt={displayName}
                className="profile-hero-avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
              <div className="profile-hero-avatar-fallback" style={{ display: 'none' }}>
                {initials}
              </div>
              <span className="profile-hero-edit-badge" title="Change Photo">
                <Icon icon="lucide:pencil" width={11} height={11} />
              </span>
            </div>

            <div className="profile-hero-meta">
              <div className="profile-hero-name-row">
                <h2 className="profile-hero-name" title={displayName}>
                  {displayName.toUpperCase()}
                </h2>
                <span className="profile-hero-lang-pill">
                  {language === 'km' ? 'ភាសាខ្មែរ' : 'English'}
                </span>
              </div>

              <div className="profile-hero-badges-row">
                <span className="profile-hero-role-pill">
                  <Icon icon="lucide:shield-check" width={12} />
                  <span>{user?.role === 'admin' ? 'Administrator' : 'Student'}</span>
                </span>
                <span className="profile-hero-id-text">
                  {studentId}
                </span>
              </div>
            </div>

            <div className="profile-hero-arrow" aria-hidden="true">
              <Icon icon="lucide:chevron-right" width={22} />
            </div>
          </section>

          {/* ── 2. Grouped Settings Card (The 6 Rows Matching Image 2) ── */}
          <div className="profile-settings-group-card">
            {/* Row 1: Language (Opens Language Sub-view) */}
            <div className="profile-setting-row" onClick={() => setView('language')}>
              <div className="profile-setting-left">
                <div className="profile-setting-icon-box icon-box--blue">
                  <Icon icon="lucide:globe" width={20} />
                </div>
                <div className="profile-setting-text">
                  <span className="profile-setting-title">Language</span>
                  <span className="profile-setting-subtitle">
                    {language === 'km'
                      ? 'English → ភាសាខ្មែរ (KH)'
                      : 'Khmer → English (EN)'}
                  </span>
                </div>
              </div>
              <div className="profile-setting-right">
                <Icon icon="lucide:chevron-right" width={20} className="profile-chevron" />
              </div>
            </div>

            <div className="profile-setting-divider" />

            {/* Row 2: Feedback */}
            <div className="profile-setting-row" onClick={() => setActiveModal('feedback')}>
              <div className="profile-setting-left">
                <div className="profile-setting-icon-box icon-box--green">
                  <Icon icon="lucide:headset" width={20} />
                </div>
                <div className="profile-setting-text">
                  <span className="profile-setting-title">Feedback</span>
                </div>
              </div>
              <div className="profile-setting-right">
                <Icon icon="lucide:chevron-right" width={20} className="profile-chevron" />
              </div>
            </div>

            <div className="profile-setting-divider" />

            {/* Row 3: Scan QR Code */}
            <div className="profile-setting-row" onClick={() => setActiveModal('pass')}>
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
                <Icon icon="lucide:chevron-right" width={20} className="profile-chevron" />
              </div>
            </div>

            <div className="profile-setting-divider" />

            {/* Row 4: Icon Theme */}
            <div className="profile-setting-row" onClick={() => setActiveModal('theme')}>
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
                <Icon icon="lucide:chevron-right" width={20} className="profile-chevron" />
              </div>
            </div>

            <div className="profile-setting-divider" />

            {/* Row 5: Dark Mode */}
            <div className="profile-setting-row" onClick={toggleDarkMode}>
              <div className="profile-setting-left">
                <div className="profile-setting-icon-box icon-box--violet">
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

            {/* Row 6: Privacy Policy */}
            <div className="profile-setting-row" onClick={() => setActiveModal('privacy')}>
              <div className="profile-setting-left">
                <div className="profile-setting-icon-box icon-box--royal">
                  <Icon icon="lucide:shield-check" width={20} />
                </div>
                <div className="profile-setting-text">
                  <span className="profile-setting-title">Privacy Policy</span>
                </div>
              </div>
              <div className="profile-setting-right">
                <Icon icon="lucide:chevron-right" width={20} className="profile-chevron" />
              </div>
            </div>

            <div className="profile-setting-divider" />

            {/* Row 7: Passcode & Biometric App Lock */}
            <div className="profile-setting-row" onClick={() => setActiveModal('biometric')}>
              <div className="profile-setting-left">
                <div className="profile-setting-icon-box icon-box--teal">
                  <Icon icon="lucide:shield-check" width={20} />
                </div>
                <div className="profile-setting-text">
                  <span className="profile-setting-title">Passcode & Biometrics</span>
                  <span
                    className="profile-setting-subtitle"
                    style={{ color: isBiometricEnabled ? '#059669' : '#64748b' }}
                  >
                    {isBiometricEnabled
                      ? `Active · Lock after ${lockTimeout === 0 ? 'Immediately' : lockTimeout + 's'}`
                      : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="profile-setting-right">
                {isBiometricEnabled && (
                  <span className="profile-theme-tag tag-default">Protected</span>
                )}
                <Icon icon="lucide:chevron-right" width={20} className="profile-chevron" />
              </div>
            </div>
          </div>

          {/* ── 3. Standalone Logout Card ── */}
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

          {/* ── Version & Footer ── */}
          <div className="profile-version-text">
            English Learning System · Version 2.6.6
          </div>
          <div className="profile-developer-footer">
            <span className="profile-developer-link">
              <Icon icon="lucide:info" width={14} />
              <span>DEVELOPED BY : YOUNG SENGHEANG ©2026</span>
            </span>
          </div>
        </>
      )}

      {/* ── Modal 1: Student Pass & QR Modal ── */}
      {activeModal === 'pass' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="profile-modal-card student-pass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              <Icon icon="lucide:x" width={18} />
            </button>

            {/* Pass Header */}
            <div className="pass-card-header">
              <EducationDegreeIcon size={40} />
              <div>
                <h3 className="pass-card-brand">English Learning System</h3>
                <span className="pass-card-badge">Official Student Pass</span>
              </div>
            </div>

            {/* Pass Body */}
            <div className="pass-card-body">
              <div className="pass-card-avatar-wrap">
                <img
                  src={user?.avatar || '/founder/Young Sengheang.jpg'}
                  alt={displayName}
                  className="pass-card-avatar"
                />
              </div>
              <h4 className="pass-card-name">{displayName.toUpperCase()}</h4>
              <p className="pass-card-email">{displayEmail}</p>

              <div className="pass-card-meta-grid">
                <div className="pass-meta-cell">
                  <span className="pass-meta-label">ID Number</span>
                  <span className="pass-meta-val">{studentId}</span>
                </div>
                <div className="pass-meta-cell">
                  <span className="pass-meta-label">Curriculum</span>
                  <span className="pass-meta-val">CEFR A1–C1</span>
                </div>
                <div className="pass-meta-cell">
                  <span className="pass-meta-label">Bilingual</span>
                  <span className="pass-meta-val">{language === 'km' ? 'ភាសាខ្មែរ (KH)' : 'English (EN)'}</span>
                </div>
                <div className="pass-meta-cell">
                  <span className="pass-meta-label">Status</span>
                  <span className="pass-meta-val pass-status-active">● Active</span>
                </div>
              </div>

              {/* Realistic Vector QR Code */}
              <div className="pass-qr-box">
                <svg
                  viewBox="0 0 120 120"
                  className="pass-qr-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="120" height="120" fill="#ffffff" rx="10" />
                  <rect x="10" y="10" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="15" y="15" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="19" y="19" width="12" height="12" rx="1" fill="#059669" />

                  <rect x="80" y="10" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="85" y="15" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="89" y="19" width="12" height="12" rx="1" fill="#059669" />

                  <rect x="10" y="80" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="15" y="85" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="19" y="89" width="12" height="12" rx="1" fill="#059669" />

                  <rect x="48" y="14" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="58" y="14" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="66" y="22" width="6" height="6" rx="1" fill="#059669" />
                  <rect x="48" y="30" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="58" y="30" width="6" height="6" rx="1" fill="#0f172a" />

                  <rect x="14" y="48" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="22" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="34" y="48" width="6" height="6" rx="1" fill="#059669" />
                  <rect x="48" y="48" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="60" y="48" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="72" y="48" width="6" height="6" rx="1" fill="#059669" />
                  <rect x="84" y="48" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="98" y="48" width="6" height="6" rx="1" fill="#0f172a" />

                  <rect x="48" y="62" width="6" height="6" rx="1" fill="#059669" />
                  <rect x="62" y="62" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="76" y="62" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="90" y="62" width="6" height="6" rx="1" fill="#059669" />

                  <rect x="48" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="58" y="88" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="70" y="80" width="6" height="6" rx="1" fill="#059669" />
                  <rect x="84" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="98" y="88" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="70" y="98" width="6" height="6" rx="1" fill="#0f172a" />
                  <rect x="88" y="98" width="6" height="6" rx="1" fill="#059669" />
                </svg>
                <span className="pass-qr-caption">Scan for Classroom & Attendance Check-in</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Feedback Modal ── */}
      {activeModal === 'feedback' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="profile-modal-card feedback-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              <Icon icon="lucide:x" width={18} />
            </button>

            <div className="feedback-modal-header">
              <div className="feedback-icon-bubble">
                <Icon icon="lucide:headset" width={26} />
              </div>
              <h3 className="feedback-modal-title">Student Feedback</h3>
              <p className="feedback-modal-desc">
                Help us improve the English Learning System for all students.
              </p>
            </div>

            {feedbackSubmitted ? (
              <div className="feedback-success-box">
                <Icon icon="lucide:check-circle" width={48} color="#059669" />
                <h4>Thank You!</h4>
                <p>Your feedback has been received by our academic team.</p>
                <button
                  type="button"
                  className="feedback-btn-primary"
                  onClick={() => {
                    setFeedbackSubmitted(false);
                    setActiveModal(null);
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                className="feedback-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFeedbackSubmitted(true);
                }}
              >
                <label className="feedback-form-label">How is your learning experience?</label>
                <div className="feedback-stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${feedbackRating >= star ? 'is-active' : ''}`}
                      onClick={() => setFeedbackRating(star)}
                    >
                      <Icon icon="lucide:star" width={24} />
                    </button>
                  ))}
                </div>

                <label className="feedback-form-label">Suggestions or Comments</label>
                <textarea
                  className="feedback-textarea"
                  rows={4}
                  placeholder="Share what features or vocabulary lessons you'd like to see..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />

                <div className="feedback-form-actions">
                  <button
                    type="button"
                    className="feedback-btn-secondary"
                    onClick={() => setActiveModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="feedback-btn-primary">
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Modal 3: Privacy Policy Modal ── */}
      {activeModal === 'privacy' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="profile-modal-card privacy-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              <Icon icon="lucide:x" width={18} />
            </button>

            <div className="privacy-modal-header">
              <div className="privacy-icon-bubble">
                <Icon icon="lucide:shield-check" width={28} />
              </div>
              <h3 className="privacy-modal-title">Privacy Policy</h3>
              <span className="privacy-modal-sub">English Learning System (ELS)</span>
            </div>

            <div className="privacy-modal-content">
              <h4>1. Account & Credential Security</h4>
              <p>
                Student accounts are created and managed by system administrators. Your credentials and learning progress are strictly protected and never shared.
              </p>

              <h4>2. Learning & Progress Analytics</h4>
              <p>
                Vocabulary searches, completed CEFR curriculum units, and quiz results are stored to personalize your bilingual English-Khmer study journey.
              </p>

              <h4>3. Bilingual Dictionary Resources</h4>
              <p>
                All bilingual Oxford definitions, phonetic transcripts, and native audio pronunciations are provided for academic learning purposes.
              </p>
            </div>

            <button
              type="button"
              className="feedback-btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setActiveModal(null)}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ── Modal 4: Icon Theme Modal ── */}
      {activeModal === 'theme' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="profile-modal-card theme-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              <Icon icon="lucide:x" width={18} />
            </button>

            <div className="feedback-modal-header">
              <div className="theme-icon-bubble">
                <Icon icon="lucide:palette" width={26} />
              </div>
              <h3 className="feedback-modal-title">Icon Theme</h3>
              <p className="feedback-modal-desc">
                Current active set: <strong>Default Icons ⚡</strong>
              </p>
            </div>

            <div className="theme-options-list">
              <div className="theme-option-item is-selected">
                <div className="theme-option-left">
                  <div className="theme-option-icon">⚡</div>
                  <div>
                    <div className="theme-option-name">Default 3D Vector Icons</div>
                    <div className="theme-option-sub">Emojione Blue Book & Liquid Library</div>
                  </div>
                </div>
                <Icon icon="lucide:check" width={20} color="#059669" />
              </div>
            </div>

            <button
              type="button"
              className="feedback-btn-primary"
              style={{ width: '100%', marginTop: '1.25rem' }}
              onClick={() => setActiveModal(null)}
            >
              Confirm Theme
            </button>
          </div>
        </div>
      )}

      {/* ── Modal 5: Biometric Settings Modal ── */}
      {activeModal === 'biometric' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="profile-modal-card biometric-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              <Icon icon="lucide:x" width={18} />
            </button>

            <div className="feedback-modal-header">
              <div className="biometric-modal-icon-bubble">
                <Icon icon="lucide:shield-check" width={32} />
              </div>
              <h3 className="feedback-modal-title">Passcode & Biometrics</h3>
              <p className="feedback-modal-desc">
                Protect your study session with a 4-digit PIN and fingerprint sensor.
              </p>
            </div>

            {/* Main Toggle Switch */}
            <div className="biometric-toggle-box">
              <div className="biometric-toggle-info">
                <div className="biometric-toggle-title">Passcode App Lock</div>
                <div className="biometric-toggle-desc">
                  Require 4-digit PIN or fingerprint when reopening app
                </div>
              </div>
              <button
                type="button"
                className={`app-ios-switch ${isBiometricEnabled ? 'is-on' : ''}`}
                onClick={() => {
                  const next = !isBiometricEnabled;
                  setIsBiometricEnabled(next);
                }}
                role="switch"
                aria-checked={isBiometricEnabled}
                aria-label="Toggle Passcode Lock"
              >
                <span className="app-ios-switch-thumb" />
              </button>
            </div>

            {isBiometricEnabled && (
              <div className="biometric-settings-details">
                {/* 4-Digit Passcode Management */}
                <div className="biometric-scope-box" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                        4-Digit Passcode
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)' }}>
                        PIN Status: <span style={{ color: '#059669', fontWeight: 700 }}>● ● ● ● Active</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{
                        background: 'rgba(5, 150, 105, 0.1)',
                        color: '#059669',
                        border: '1px solid rgba(5, 150, 105, 0.3)',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setShowPinChange(!showPinChange);
                        setPinMsg({ text: '', isError: false });
                      }}
                    >
                      {showPinChange ? 'Cancel' : 'Change PIN'}
                    </button>
                  </div>

                  {showPinChange && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="Current PIN (default 1234)"
                        value={pinOld}
                        onChange={(e) => setPinOld(e.target.value)}
                        className="biometric-password-input"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                      />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="New 4-digit PIN"
                        value={pinNew}
                        onChange={(e) => setPinNew(e.target.value)}
                        className="biometric-password-input"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                      />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="Confirm new 4-digit PIN"
                        value={pinConfirm}
                        onChange={(e) => setPinConfirm(e.target.value)}
                        className="biometric-password-input"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                      />
                      {pinMsg.text && (
                        <div style={{ fontSize: '12px', fontWeight: 600, color: pinMsg.isError ? '#ef4444' : '#10b981' }}>
                          {pinMsg.text}
                        </div>
                      )}
                      <button
                        type="button"
                        className="feedback-btn-primary"
                        style={{ padding: '8px 14px', fontSize: '13px', marginTop: '4px' }}
                        onClick={() => {
                          if (!pinOld) {
                            setPinMsg({ text: 'Please enter your current PIN.', isError: true });
                            return;
                          }
                          if (!/^\d{4}$/.test(pinNew)) {
                            setPinMsg({ text: 'New PIN must be exactly 4 digits.', isError: true });
                            return;
                          }
                          if (pinNew !== pinConfirm) {
                            setPinMsg({ text: 'New PIN and confirm PIN do not match.', isError: true });
                            return;
                          }
                          const res = changePasscode(pinOld, pinNew);
                          if (res.success) {
                            setPinMsg({ text: '✅ Passcode changed successfully!', isError: false });
                            setPinOld('');
                            setPinNew('');
                            setPinConfirm('');
                            setTimeout(() => setShowPinChange(false), 1200);
                          } else {
                            setPinMsg({ text: res.message || 'Incorrect current PIN.', isError: true });
                          }
                        }}
                      >
                        Save New Passcode
                      </button>
                    </div>
                  )}
                </div>

                {/* Unlock with Biometrics Toggle */}
                <div className="biometric-toggle-box" style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                  <div className="biometric-toggle-info">
                    <div className="biometric-toggle-title" style={{ fontSize: '13.5px' }}>
                      Unlock with Fingerprint / Face ID
                    </div>
                    <div className="biometric-toggle-desc" style={{ fontSize: '12px' }}>
                      Tap fingerprint shortcut on passcode keypad
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`app-ios-switch ${biometricsEnabled ? 'is-on' : ''}`}
                    onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                    role="switch"
                    aria-checked={biometricsEnabled}
                  >
                    <span className="app-ios-switch-thumb" />
                  </button>
                </div>

                {/* Scope selector */}
                <div className="biometric-scope-box" style={{ marginTop: '10px' }}>
                  <div className="biometric-scope-header">
                    <span className="biometric-sub-label">Enforce Lock Mode:</span>
                    <span className={`biometric-env-badge ${isStandalone ? 'is-pwa' : ''}`}>
                      {isStandalone ? '📱 Installed to Home Screen' : '🌐 Browser View'}
                    </span>
                  </div>

                  <div className="biometric-scope-radios">
                    <label className="biometric-radio-row">
                      <input
                        type="radio"
                        name="scope"
                        checked={onlyWhenInstalled}
                        onChange={() => setOnlyWhenInstalled(true)}
                      />
                      <span>Only when installed to Home Screen (Mobile App)</span>
                    </label>

                    <label className="biometric-radio-row">
                      <input
                        type="radio"
                        name="scope"
                        checked={!onlyWhenInstalled}
                        onChange={() => setOnlyWhenInstalled(false)}
                      />
                      <span>Always on this device (Browser & App)</span>
                    </label>
                  </div>
                </div>

                {/* Timeout Selector */}
                <div className="biometric-timeout-box" style={{ marginTop: '10px' }}>
                  <span className="biometric-sub-label">Auto-Lock After Inactivity / App Switch:</span>
                  <div className="biometric-timeout-grid">
                    {[
                      { seconds: 0, label: 'Immediately' },
                      { seconds: 15, label: '15 seconds' },
                      { seconds: 30, label: '30 seconds' },
                      { seconds: 60, label: '1 minute' },
                      { seconds: 300, label: '5 minutes' },
                    ].map((item) => (
                      <button
                        key={item.seconds}
                        type="button"
                        className={`biometric-timeout-chip ${lockTimeout === item.seconds ? 'is-selected' : ''}`}
                        onClick={() => setLockTimeout(item.seconds)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="biometric-modal-actions" style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="biometric-lock-now-btn"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setActiveModal(null);
                      manualLock();
                    }}
                  >
                    <Icon icon="lucide:lock" width={16} />
                    <span>Lock App Now</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className="feedback-btn-primary"
              style={{ width: '100%', marginTop: '1.25rem' }}
              onClick={() => setActiveModal(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Modal 6: Change Profile Photo Modal ── */}
      {activeModal === 'avatar' && (
        <div className="profile-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="profile-modal-card avatar-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              <Icon icon="lucide:x" width={18} />
            </button>

            <div className="feedback-modal-header">
              <div className="avatar-modal-icon-bubble">
                <Icon icon="lucide:camera" width={28} />
              </div>
              <h3 className="feedback-modal-title">Change Profile Photo</h3>
              <p className="feedback-modal-desc">
                Upload a photo from your device or choose a student avatar.
              </p>
            </div>

            {/* Circular Preview with Glow Ring */}
            <div className="avatar-preview-container">
              <div className="avatar-preview-wrap">
                <img
                  src={selectedAvatar}
                  alt="Avatar Preview"
                  className="avatar-preview-img"
                  onError={(e) => {
                    e.currentTarget.src = '/founder/Young Sengheang.jpg';
                  }}
                />
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Upload Button */}
            <button
              type="button"
              className="avatar-upload-action-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon icon="lucide:upload-cloud" width={20} />
              <span>Choose Photo from Device</span>
            </button>

            {/* Presets Gallery */}
            <div className="avatar-presets-section">
              <span className="avatar-presets-label">Or Pick a Student Avatar:</span>
              <div className="avatar-presets-grid">
                {[
                  { id: 'p1', src: '/founder/Young Sengheang.jpg', label: 'Default' },
                  { id: 'p2', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80', label: 'Scholar' },
                  { id: 'p3', src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80', label: 'Graduate' },
                  { id: 'p4', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80', label: 'Academic' },
                  { id: 'p5', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80', label: 'Leader' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`avatar-preset-btn ${selectedAvatar === item.src ? 'is-selected' : ''}`}
                    onClick={() => setSelectedAvatar(item.src)}
                    title={item.label}
                  >
                    <img src={item.src} alt={item.label} />
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="avatar-modal-footer">
              <button
                type="button"
                className="feedback-btn-secondary"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="feedback-btn-primary"
                onClick={handleSaveAvatar}
                disabled={avatarSaving}
              >
                {avatarSaving ? 'Saving…' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
