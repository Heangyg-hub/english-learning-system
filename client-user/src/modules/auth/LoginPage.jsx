import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import './login-page.css';

export default function LoginPage() {
  const [email, setEmail] = useState('sengheang@els.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-badge">
            <img
              src="/Logo/logo-cls-system-default.png"
              alt="ELS Logo"
              className="auth-brand-logo-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="auth-title">ELS Student</h1>
          <p className="auth-subtitle">English Learning System — Student Portal</p>
          <div className="auth-tones" aria-hidden="true">
            <span className="tone-mark-1">ā</span>
            <span className="tone-mark-2">á</span>
            <span className="tone-mark-3">ǎ</span>
            <span className="tone-mark-4">à</span>
          </div>
        </div>

        {error && (
          <div className="auth-alert-error">
            <Icon icon="lucide:alert-triangle" width={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="auth-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sengheang@cls.com"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              Password
            </label>
            <div className="auth-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="auth-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                className="auth-input-affix-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} width={18} />
              </button>
            </div>
          </div>

          <label className="auth-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember this device</span>
          </label>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon icon="lucide:loader-2" width={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Signing in…</span>
              </>
            ) : (
              'Sign in to Learn'
            )}
          </button>
        </form>

        <p className="auth-footnote">Student accounts only</p>
      </div>
    </div>
  );
}
