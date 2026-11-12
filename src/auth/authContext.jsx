import React, { createContext, useContext, useState } from 'react';

/**
 * Authentication Context for A.B.N. HERBALS Billing Application
 * Secure cryptographic verification without storing credentials in source code.
 */

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {}
});

// Cryptographic hash constants (SHA-256)
const H_ID = '6bc2fc6f7bd8973f016ac5b528e20ba3aa77e68fa2dccf23f9ddda0937d7d388';
const H_KEY = 'fe3eaaef794079f1c090fef90e22c1c20b4b911997abe3c3f408581f9f3e9e2f';

async function digestString(str) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('abn_auth_token') === 'active';
  });

  const [user, setUser] = useState(() => {
    return sessionStorage.getItem('abn_auth_token') === 'active'
      ? { id: 'admin-1', role: 'ADMIN' }
      : null;
  });

  const login = async (identifier, secret) => {
    if (!identifier || !secret) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    try {
      const idHash = await digestString(identifier.trim().toLowerCase());
      const secretHash = await digestString(secret);

      if (idHash === H_ID && secretHash === H_KEY) {
        sessionStorage.setItem('abn_auth_token', 'active');
        setIsAuthenticated(true);
        setUser({ id: 'admin-1', role: 'ADMIN' });
        return { success: true };
      } else {
        return { success: false, message: 'Invalid username or password. Access denied.' };
      }
    } catch (err) {
      console.error('Authentication error:', err);
      return { success: false, message: 'An authentication error occurred. Please try again.' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('abn_auth_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
