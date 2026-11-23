import React, { createContext, useContext, useState, useEffect } from 'react';
import { initToken, getTokenAsync, setToken, removeToken, isTokenExpired } from '../utils/auth';
import { ENDPOINTS } from '../constants/config';

const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredToken() {
      try {
        const stored = await initToken();
        if (stored && !isTokenExpired(stored)) {
          setTokenState(stored);
        } else if (stored) {
          await removeToken();
          setTokenState(null);
        }
      } catch (err) {
        console.warn('Erro ao inicializar auth:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredToken();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || data.mensagem || 'Falha no login');
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error('Token não retornado pela API');
    }

    await setToken(data.token);
    setTokenState(data.token);
    return data.token;
  };

  const logout = async () => {
    await removeToken();
    setTokenState(null);
  };

  const isAuthenticated = !!token && !isTokenExpired(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
}
