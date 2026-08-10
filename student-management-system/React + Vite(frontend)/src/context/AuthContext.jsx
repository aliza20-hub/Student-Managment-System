import { createContext, useContext, useState, useCallback } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('sms_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser());

  const login = useCallback(async (username, password) => {
    const data = await authApi.login(username, password);
    persist(data);
    return data;
  }, []);

  const register = useCallback(async (username, email, password, role) => {
    const data = await authApi.register(username, email, password, role);
    persist(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    setUser(null);
  }, []);

  function persist(data) {
    const userInfo = { username: data.username, roles: data.roles };
    localStorage.setItem('sms_token', data.token);
    localStorage.setItem('sms_user', JSON.stringify(userInfo));
    setUser(userInfo);
  }

  const hasRole = useCallback(
    (role) => !!user && Array.isArray(user.roles) && user.roles.some((r) => r.includes(role)),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
