import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem('english_user_token') || sessionStorage.getItem('english_user_token') || null
  );

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('english_user_info') || sessionStorage.getItem('english_user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        if (token === 'demo-jwt-student-token') {
          setLoading(false);
          return;
        }

        try {
          const res = await api.get('/auth/me');
          const userData = res?.data || res;
          if (userData && (userData._id || userData.email)) {
            setUser(userData);
            if (localStorage.getItem('english_user_token')) {
              localStorage.setItem('english_user_info', JSON.stringify(userData));
            } else {
              sessionStorage.setItem('english_user_info', JSON.stringify(userData));
            }
          }
        } catch (err) {
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password, remember = true) => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    try {
      const res = await api.post('/auth/login', { email: normalizedEmail, password });
      const payload = res?.data || res;
      const receivedToken = payload?.token || res?.token;
      const receivedUser = payload?.user || res?.user;

      if (!receivedToken || !receivedUser) {
        throw new Error('Authentication response is missing token or user data.');
      }

      if (remember) {
        localStorage.setItem('english_user_token', receivedToken);
        localStorage.setItem('english_user_info', JSON.stringify(receivedUser));
        localStorage.setItem('els_remember_email', normalizedEmail);
      } else {
        sessionStorage.setItem('english_user_token', receivedToken);
        sessionStorage.setItem('english_user_info', JSON.stringify(receivedUser));
        localStorage.removeItem('els_remember_email');
      }

      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } catch (err) {
      const isNetworkError =
        err.code === 'ERR_NETWORK' ||
        !err.response ||
        err.message?.includes('Network Error');

      // Offline / network fallback for test credentials so dev preview remains responsive
      if (
        isNetworkError &&
        (normalizedEmail === 'sengheang@els.com' ||
          normalizedEmail === 'user@english.com' ||
          normalizedEmail === 'student@els.com')
      ) {
        const demoUser = {
          _id: 'demo-student-id-01',
          username: normalizedEmail.includes('sengheang') ? 'Sengheang' : 'Student Learner',
          email: normalizedEmail,
          role: 'user',
          avatar: '/founder/Young Sengheang.jpg',
        };
        const demoToken = 'demo-jwt-student-token';

        if (remember) {
          localStorage.setItem('english_user_token', demoToken);
          localStorage.setItem('english_user_info', JSON.stringify(demoUser));
          localStorage.setItem('els_remember_email', normalizedEmail);
        } else {
          sessionStorage.setItem('english_user_token', demoToken);
          sessionStorage.setItem('english_user_info', JSON.stringify(demoUser));
        }

        setToken(demoToken);
        setUser(demoUser);
        return demoUser;
      }

      throw err;
    }
  };

  const register = async (username, email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const res = await api.post('/auth/register', { username, email: normalizedEmail, password });
    const payload = res?.data || res;
    const receivedToken = payload?.token || res?.token;
    const receivedUser = payload?.user || res?.user;

    if (!receivedToken || !receivedUser) {
      throw new Error('Registration response missing credentials.');
    }

    localStorage.setItem('english_user_token', receivedToken);
    localStorage.setItem('english_user_info', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('english_user_token');
    localStorage.removeItem('english_user_info');
    sessionStorage.removeItem('english_user_token');
    sessionStorage.removeItem('english_user_info');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async ({ username, avatar }) => {
    try {
      const res = await api.put('/auth/profile', { username, avatar });
      const updatedUser = res?.data || res;
      if (updatedUser) {
        setUser((prev) => {
          const merged = { ...prev, ...updatedUser };
          if (localStorage.getItem('english_user_token')) {
            localStorage.setItem('english_user_info', JSON.stringify(merged));
          } else {
            sessionStorage.setItem('english_user_info', JSON.stringify(merged));
          }
          return merged;
        });
        return updatedUser;
      }
    } catch (err) {
      // Offline fallback
      const merged = {
        ...user,
        ...(username ? { username } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      };
      setUser(merged);
      if (localStorage.getItem('english_user_token')) {
        localStorage.setItem('english_user_info', JSON.stringify(merged));
      } else {
        sessionStorage.setItem('english_user_info', JSON.stringify(merged));
      }
      return merged;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
