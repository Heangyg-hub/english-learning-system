import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useBiometrics } from '../context/BiometricContext';
import { useAuth } from '../context/AuthContext';
import EducationDegreeIcon from './EducationDegreeIcon';
import './biometric-lock.css';

export default function BiometricLockOverlay() {
  const { isLocked, authenticateBiometrics, isAuthenticating, unlockWithPassword, setIsLocked } =
    useBiometrics();
  const { user } = useAuth();

  const [fallbackMode, setFallbackMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sensorHint, setSensorHint] = useState('');

  // Auto-prompt biometrics only if a passkey was already registered on this device
  useEffect(() => {
    if (isLocked && !fallbackMode) {
      const hasEnrolled = localStorage.getItem('els_passkey_id');
      if (hasEnrolled) {
        const timer = setTimeout(() => {
          authenticateBiometrics();
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [isLocked, fallbackMode]);

  if (!isLocked) return null;

  const handleScanClick = async () => {
    setSensorHint('');
    const res = await authenticateBiometrics();
    if (!res?.success && res?.message) {
      setSensorHint(res.message);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordInput) return;
    const ok = unlockWithPassword(passwordInput);
    if (ok) {
      setPasswordInput('');
      setErrorMsg('');
      setSensorHint('');
      setFallbackMode(false);
    } else {
      setErrorMsg('Incorrect password. Please try again.');
    }
  };

  const displayName = user?.name || user?.username || 'Student';

  return (
    <div className="biometric-lock-backdrop" role="dialog" aria-modal="true" aria-label="App Lock">
      <div className="biometric-lock-card">
        {/* Top Logo */}
        <div className="biometric-lock-header">
          <EducationDegreeIcon size={48} />
          <div className="biometric-lock-brand">
            <span className="biometric-lock-badge">ELS Security Shield</span>
            <h2 className="biometric-lock-title">ELS Student Locked</h2>
          </div>
        </div>

        {/* User Cardlet */}
        <div className="biometric-lock-user">
          <img
            src={user?.avatar || '/founder/Young Sengheang.jpg'}
            alt={displayName}
            className="biometric-lock-avatar"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div className="biometric-user-name">{displayName}</div>
            <div className="biometric-user-desc">Active Student Session</div>
          </div>
        </div>

        {/* Mode: Biometrics or Fallback Password */}
        {!fallbackMode ? (
          <div className="biometric-sensor-section">
            <button
              type="button"
              className={`biometric-fingerprint-btn ${isAuthenticating ? 'is-scanning' : ''}`}
              onClick={handleScanClick}
              title="Tap to scan fingerprint or Face"
            >
              <div className="fingerprint-scan-ring" />
              <div className="fingerprint-scan-ring ring-outer" />
              <Icon icon="lucide:fingerprint" width={64} height={64} className="fingerprint-icon" />
            </button>

            <p className="biometric-sensor-hint">
              {isAuthenticating
                ? 'Verifying biometric sensor…'
                : sensorHint || 'Touch fingerprint sensor or scan Face to unlock'}
            </p>

            <button
              type="button"
              className="biometric-unlock-action-btn"
              onClick={handleScanClick}
              disabled={isAuthenticating}
            >
              <Icon icon="lucide:fingerprint" width={20} />
              <span>Unlock with Biometrics</span>
            </button>

            <button
              type="button"
              className="biometric-switch-fallback-btn"
              onClick={() => {
                setFallbackMode(true);
                setErrorMsg('');
              }}
            >
              <Icon icon="lucide:key-round" width={16} />
              <span>Use Account Password</span>
            </button>
          </div>
        ) : (
          <form className="biometric-fallback-form" onSubmit={handlePasswordSubmit}>
            <p className="biometric-fallback-desc">
              Enter your student account password to unlock.
            </p>

            {errorMsg && (
              <div className="biometric-error-alert">
                <Icon icon="lucide:alert-circle" width={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="biometric-input-wrap">
              <input
                type="password"
                className="biometric-password-input"
                placeholder="Enter password (e.g. Admin@heang123$)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
            </div>

            <button type="submit" className="biometric-unlock-action-btn">
              <span>Unlock Session</span>
            </button>

            <button
              type="button"
              className="biometric-switch-fallback-btn"
              onClick={() => {
                setFallbackMode(false);
                setErrorMsg('');
              }}
            >
              <Icon icon="lucide:fingerprint" width={16} />
              <span>Back to Fingerprint</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

