'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';
import { localStore } from '@/lib/api/store';
import { MOCK_USERS } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, role?: Role) => Promise<User>;
  register: (fullName: string, email: string, phone: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateProfile: (data: { full_name?: string; email?: string; phone?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Default to the first customer user
    const saved = localStore.getCurrentUser();
    setUser(saved || MOCK_USERS[0]);
    setMounted(true);
  }, []);

  const login = async (emailOrPhone: string, requestedRole: Role = 'customer'): Promise<User> => {
    // Check if matches known mock users
    let match = MOCK_USERS.find(
      u => (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone)
    );

    if (!match) {
      // Find by requested role or fallback
      match = MOCK_USERS.find(u => u.role === requestedRole) || {
        id: `user-${Date.now()}`,
        full_name: emailOrPhone.split('@')[0] || 'Customer',
        email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@user.ncelectro.in`,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '9864012345',
        role: requestedRole,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }

    setUser(match);
    localStore.saveCurrentUser(match);
    return match;
  };

  const register = async (fullName: string, email: string, phone: string): Promise<User> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      full_name: fullName,
      email,
      phone,
      role: 'customer',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    localStore.saveCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nc_current_user');
      localStorage.removeItem('nc_access_token');
    }
  };

  const switchRole = (newRole: Role) => {
    const targetUser = MOCK_USERS.find(u => u.role === newRole) || {
      id: `user-${newRole}`,
      full_name: newRole === 'super_admin' ? 'Super Admin Nitul' : newRole === 'sub_admin' ? 'Operations Sub-Admin' : 'Bhaskar Jyoti Das',
      email: `${newRole}@ncelectro.in`,
      phone: '9864099999',
      role: newRole,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUser(targetUser);
    localStore.saveCurrentUser(targetUser);
  };

  const updateProfile = (data: { full_name?: string; email?: string; phone?: string }) => {
    if (!user) return;
    const updated: User = {
      ...user,
      ...(data.full_name ? { full_name: data.full_name } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
    };
    setUser(updated);
    localStore.saveCurrentUser(updated);
  };

  const value: AuthContextType = {
    user,
    role: user?.role || 'customer',
    isAuthenticated: !!user,
    login,
    register,
    logout,
    switchRole,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
