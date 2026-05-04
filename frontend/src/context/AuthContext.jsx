import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

const savedUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(savedUser);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const persist = (auth) => {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify(auth));
    setToken(auth.token);
    setUser(auth);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persist(data);
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    persist(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'ADMIN',
    login,
    signup,
    logout,
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
