'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

import type { UserRole } from './roles';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    async function init() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const u = data.session?.user ?? null;
        setUser(u);
        if (u) await fetchRole(u.id);
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    }

    init();

    // Safety fallback so the UI never hangs forever
    timeoutId = setTimeout(() => setLoading(false), 3000);

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) await fetchRole(u.id);
      else {
        setRole(null);
        setIsAdmin(false);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  async function fetchRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      setRole(data?.role ?? null);
      setIsAdmin(data?.is_admin ?? false);
    } catch (err) {
      console.error('fetchRole error:', err);
      setRole(null);
      setIsAdmin(false);
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
