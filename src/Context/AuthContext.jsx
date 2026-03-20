import React, { createContext, useContext, useState, useEffect } from 'react';
import { api as insforge } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await insforge.database
          .from('configurations')
          .select('value')
          .match({ key: 'admin_session' })
          .single();

        if (data && data.value && data.value.isLoggedIn) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    if (email === 'admin@gmail.com' && password === 'admin123') {
      setIsAuthenticated(true);
      await insforge.database
        .from('configurations')
        .upsert({ key: 'admin_session', value: { isLoggedIn: true, lastLogin: new Date().toISOString() } });
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await insforge.database
      .from('configurations')
      .update({ value: { isLoggedIn: false } })
      .match({ key: 'admin_session' });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
