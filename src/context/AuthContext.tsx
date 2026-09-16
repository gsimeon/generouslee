import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: (User & { savedContentIds: string[] }) | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string, interests?: string[]) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
  toggleSave: (contentId: string) => Promise<boolean>;
  isSaved: (contentId: string) => boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'onboarding' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'onboarding' | 'forgot') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { savedContentIds: string[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'onboarding' | 'forgot'>('login');

  useEffect(() => {
    async function loadInitialUser() {
      try {
        const u = await api.getMe();
        setUser(u);
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialUser();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const u = await api.login(email);
      setUser(u);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, interests: string[] = []) => {
    setIsLoading(true);
    try {
      const newUser = await api.register({ name, email, interests });
      setUser({ ...newUser, savedContentIds: [] });
      setAuthModalMode('onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const u = await api.switchRole(role);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const updateInterests = async (interests: string[]) => {
    if (!user) return;
    const updated = await api.updateInterests(interests);
    setUser({ ...updated, savedContentIds: user.savedContentIds });
  };

  const toggleSave = async (contentId: string): Promise<boolean> => {
    if (!user) {
      openAuthModal('login');
      return false;
    }
    const res = await api.toggleSaveContent(contentId);
    setUser(prev => prev ? { ...prev, savedContentIds: res.savedContentIds } : null);
    return res.isSaved;
  };

  const isSaved = (contentId: string) => {
    return Boolean(user?.savedContentIds?.includes(contentId));
  };

  const openAuthModal = (mode: 'login' | 'register' | 'onboarding' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        switchRole,
        updateInterests,
        toggleSave,
        isSaved,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
