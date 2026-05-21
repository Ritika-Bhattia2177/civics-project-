import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('civic-routes-token') || sessionStorage.getItem('civic-routes-token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('civic-routes-token');
        sessionStorage.removeItem('civic-routes-token');
      })
      .finally(() => setLoading(false));
  }, []);

  const persistToken = (token, remember = true) => {
    if (remember) {
      localStorage.setItem('civic-routes-token', token);
      sessionStorage.removeItem('civic-routes-token');
      return;
    }
    sessionStorage.setItem('civic-routes-token', token);
    localStorage.removeItem('civic-routes-token');
  };

  const login = async (credentials, options = {}) => {
    const remember = options.remember ?? true;
    const { data } = await api.post('/auth/login', credentials);
    persistToken(data.token, remember);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload, options = {}) => {
    const remember = options.remember ?? true;
    const { data } = await api.post('/auth/register', payload);
    persistToken(data.token, remember);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('civic-routes-token');
    sessionStorage.removeItem('civic-routes-token');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch('/auth/me', payload);
    setUser(data.user);
    return data.user;
  };

  const changePassword = async (payload) => {
    const { data } = await api.patch('/auth/change-password', payload);
    return data;
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile, changePassword }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
