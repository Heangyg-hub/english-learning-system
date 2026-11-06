import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useBiometrics } from '../context/BiometricContext';
import { useAuth } from '../context/AuthContext';
import EducationDegreeIcon from './EducationDegreeIcon';
import './biometric-lock.css';

export default function BiometricLockOverlay() {
  const {
    isLocked,
    authenticateBiometrics,
    isAuthenticating,
    unlockWithPasscode,
    unlockWithPassword,
    biometricsEnabled,
  } = useBiometrics();
  const { user } = useAuth();

  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fallbackMode, setFallbackMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const autoPromptRef = useRef(false);

  // Auto trigger biometrics prompt once when locked if biometrics is enabled and enrolled
  useEffect(() => {
    if (isLocked && !fallbackMode && biometricsEnabled && !autoPromptRef.current) {
      autoPromptRef.current = true;
      const hasEnrolled = localStorage.getItem('els_passkey_id');
      if (hasEnrolled) {
        const timer = setTimeout(() => {
          authenticateBiometrics();
        }, 300);
        return () => clearTimeout(timer);
      }
    }
    if (!isLocked) {
      autoPromptRef.current = false;
      setPin('');
      setIsSuccess(false);
      setIsShaking(false);
      setErrorMsg('');
      setFallbackMode(false);
    }
  }, [isLocked, fallbackMode, biometricsEnabled, authenticateBiometrics]);

  if (!isLocked) return null;

  // Handle Digit Key Press
  const handleDigitPress = (digit) => {
    if (pin.length >= 4 || isSuccess) return;

    const newPin = pin + digit;
    setPin(newPin);
    setErrorMsg('');

    // When 4th digit is entered, verify immediately
    if (newPin.length === 4) {
      const ok = unlockWithPasscode(newPin);
      if (ok) {
        setIsSuccess(true);
        if (navigator.vibrate) navigator.vibrate(40);
        setTimeout(() => {
          setPin('');
          setIsSuccess(false);
        }, 180);
      } else {
        setIsShaking(true);
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
        setTimeout(() => {
          setIsShaking(false);
          setPin('');
          setErrorMsg('Incorrect passcode. Default PIN is 1234');
        }, 450);
      }
    }
  };

  // Handle Backspace Key Press
  const handleBackspace = () => {
    if (isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  // Handle Biometric Button Press
  const handleBiometricPress = async () => {
    setErrorMsg('');
    const res = await authenticateBiometrics();
    if (!res?.success && res?.message) {
      setErrorMsg(res.message);
    }
  };

  // Handle Full Password Fallback Submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordInput) return;
    const ok = unlockWithPassword(passwordInput);
    if (ok) {
      setPasswordInput('');
      setPasswordError('');
      setFallbackMode(false);
    } else {
      setPasswordError('Incorrect account password. Please try again.');
    }
  };

  const displayName = user?.name || user?.username || 'Student';

  return (
    <div className="biometric-lock-backdrop" role="dialog" aria-modal="true" aria-label="Passcode App Lock">
      <div className="biometric-lock-card passcode-card">
        {/* Top Header */}
        <div className="biometric-lock-header">
          <EducationDegreeIcon size={44} />
          <div className="biometric-lock-brand">
            <span className="biometric-lock-badge">
              <Icon icon="lucide:shield-check" width={12} style={{ marginRight: 4 }} />
              Security Shield
            </span>
            <h2 className="biometric-lock-title">Enter Passcode</h2>
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

        {!fallbackMode ? (
          /* ── Numeric Keypad Lock Screen ── */
          <div className="passcode-container">
            {/* 4 Circle Dots */}
            <div
              className={`passcode-dots ${isShaking ? 'is-shaking' : ''} ${isSuccess ? 'is-success' : ''}`}
            >
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`passcode-dot ${pin.length > idx ? 'is-filled' : ''}`}
                />
              ))}
            </div>

            {/* Error or Hint Message */}
            <p className={`passcode-hint-msg ${errorMsg ? 'is-error' : ''}`}>
              {errorMsg || 'Enter your 4-digit passcode to unlock'}
            </p>

            {/* 3x4 Number Keypad */}
            <div className="passcode-keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  className="passcode-key-btn"
                  onClick={() => handleDigitPress(digit)}
                >
                  <span className="passcode-digit">{digit}</span>
                </button>
              ))}

              {/* Bottom Row: Fingerprint Key | '0' | Backspace Key */}
              <button
                type="button"
                className={`passcode-key-btn passcode-action-key ${isAuthenticating ? 'is-scanning' : ''}`}
                onClick={handleBiometricPress}
                title="Unlock with Fingerprint or Face"
                aria-label="Unlock with Fingerprint"
              >
                <Icon icon="lucide:fingerprint" width={28} className="passcode-fp-icon" />
              </button>

              <button
                type="button"
                className="passcode-key-btn"
                onClick={() => handleDigitPress('0')}
              >
                <span className="passcode-digit">0</span>
              </button>

              <button
                type="button"
                className="passcode-key-btn passcode-action-key"
                onClick={handleBackspace}
                title="Delete digit"
                aria-label="Delete digit"
              >
                <Icon icon="lucide:delete" width={24} />
              </button>
            </div>

            {/* Password Fallback Link */}
            <button
              type="button"
              className="passcode-fallback-link-btn"
              onClick={() => {
                setFallbackMode(true);
                setPasswordError('');
              }}
            >
              <Icon icon="lucide:key-round" width={14} />
              <span>Use Account Password</span>
            </button>
          </div>
        ) : (
          /* ── Account Password Form ── */
          <form className="biometric-fallback-form" onSubmit={handlePasswordSubmit}>
            <p className="biometric-fallback-desc">
              Enter your student account password to unlock this session.
            </p>

            {passwordError && (
              <div className="biometric-error-alert">
                <Icon icon="lucide:alert-circle" width={16} />
                <span>{passwordError}</span>
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
                setPasswordError('');
              }}
            >
              <Icon icon="lucide:grid-3x3" width={16} />
              <span>Back to Passcode Keypad</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
