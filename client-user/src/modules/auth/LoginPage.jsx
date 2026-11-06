import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import EducationDegreeIcon from '../../components/EducationDegreeIcon';
import { useAuth } from '../../context/AuthContext';
import './login-page.css';

export default function LoginPage() {
  const [remember, setRemember] = useState(() => {
    return localStorage.getItem('els_remember_me') !== 'false';
  });

  const [email, setEmail] = useState(() => {
    const savedRemember = localStorage.getItem('els_remember_me');
    if (savedRemember === 'false') return '';
    return localStorage.getItem('els_remember_email') || 'Sengheang@els.com';
  });

  const [password, setPassword] = useState(() => {
    const savedRemember = localStorage.getItem('els_remember_me');
    if (savedRemember === 'false') return '';
    return localStorage.getItem('els_remember_password') || 'Admin@heang123$';
  });

  const [showPassword, setShowPassword] = useState(false);
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

  const handleRememberToggle = (checked) => {
    setRemember(checked);
    if (!checked) {
      localStorage.setItem('els_remember_me', 'false');
      localStorage.removeItem('els_remember_email');
      localStorage.removeItem('els_remember_password');
    } else {
      localStorage.setItem('els_remember_me', 'true');
      if (email.trim()) localStorage.setItem('els_remember_email', email.trim());
      if (password) localStorage.setItem('els_remember_password', password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    setError('');

    // Persist credentials when "Remember me" is checked
    if (remember) {
      localStorage.setItem('els_remember_me', 'true');
      localStorage.setItem('els_remember_email', email.trim());
      localStorage.setItem('els_remember_password', password);
    } else {
      localStorage.setItem('els_remember_me', 'false');
      localStorage.removeItem('els_remember_email');
      localStorage.removeItem('els_remember_password');
    }

    try {
      await login(email.trim(), password, remember);
      navigate(from, { replace: true });
    } catch (err) {
      const isNetworkError =
        err.code === 'ERR_NETWORK' ||
        !err.response ||
        err.message?.includes('Network Error');

      if (isNetworkError) {
        setError(
          'Server offline or unreachable. Please verify server status or use the demo student account.'
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Invalid credentials. Please verify your email and password.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* Brand Header (Matched to Admin) */}
        <div className="auth-brand">
          <div className="auth-brand-badge">
            <EducationDegreeIcon size={56} />
          </div>
          <h1 className="auth-title">Student Sign In</h1>
          <p className="auth-subtitle">English Learning System</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert-error" role="alert">
            <Icon icon="lucide:alert-circle" width={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Address */}
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              <span style={{ color: '#ef4444', marginRight: 4 }}>*</span>
              Email Address
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-prefix">
                <Icon icon="lucide:mail" width={18} />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="auth-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Sengheang@els.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              <span style={{ color: '#ef4444', marginRight: 4 }}>*</span>
              Password
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-prefix">
                <Icon icon="lucide:lock" width={18} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="auth-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {/* Remember Me Checkbox */}
          <div>
            <label
              className="auth-remember"
              title="Remember username and password for quick 1-click sign in"
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => handleRememberToggle(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Icon
                  icon="lucide:loader-2"
                  width={18}
                  style={{ animation: 'spin 1s linear infinite' }}
                />
                <span>Signing in…</span>
              </>
            ) : (
              'Log In to Student'
            )}
          </button>
        </form>

        {/* Footnote matching Admin */}
        {/* <div className="auth-footnote">
          <span>
            Default credentials:{' '}
            <code>Sengheang@els.com</code> / <code>Admin@heang123$</code>
          </span>
        </div> */}
      </div>
    </div>
  );
}
