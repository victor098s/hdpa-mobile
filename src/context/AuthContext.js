import React, { createContext, useContext, useState, useEffect } from 'react';
import { initToken, getTokenAsync, setToken, removeToken, isTokenExpired } from '../utils/auth';
import { ENDPOINTS } from '../constants/config';

// Contexto compartilhado que define os valores padrão antes do provider ser inicializado.
const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  // Estados responsáveis pelo token atual e pelo carregamento inicial da autenticação.
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Na montagem, restaura o token armazenado e remove sessões que já expiraram.
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

  // Autentica o usuário na API e salva o token recebido para manter a sessão.
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

  // Remove o token persistido e limpa a autenticação no estado da aplicação.
  const logout = async () => {
    await removeToken();
    setTokenState(null);
  };

  // A sessão só é considerada ativa quando existe token válido e não expirado.
  const isAuthenticated = !!token && !isTokenExpired(token);

  return (
    // Disponibiliza dados e ações de autenticação para todos os componentes filhos.
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

// Hook de acesso ao contexto, com validação para impedir uso fora do provider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
}
