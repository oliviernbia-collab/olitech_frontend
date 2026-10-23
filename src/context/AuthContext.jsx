import { createContext, useContext, useState } from 'react';
import { login as loginApi } from '../api/authApi';

const TOKEN_KEY = 'olitech_admin_token';
const ADMIN_KEY = 'olitech_admin_info';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem(ADMIN_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
    return data.admin;
  };

  // Utilise apres une mise a jour de profil (nom/email/mot de passe) : le
  // token change (nouveau payload), donc on rafraichit la session comme au login.
  const updateSession = (newToken, newAdmin) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated: !!token, login, logout, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
