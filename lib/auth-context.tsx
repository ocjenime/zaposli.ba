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
  const [sessionLoading, setSessionLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const loading = sessionLoading || roleLoading;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    async function init() {
      setSessionLoading(true);
      setRoleLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const u = data.session?.user ?? null;
        setUser(u);
        if (u) {
          await fetchRole(u.id);
        } else {
          setRole(null);
          setIsAdmin(false);
          setRoleLoading(false);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        setRole(null);
        setIsAdmin(false);
        setRoleLoading(false);
      } finally {
        setSessionLoading(false);
        clearTimeout(timeoutId);
      }
    }

    init();

    // Safety fallback so the UI never hangs forever
    timeoutId = setTimeout(() => {
      setSessionLoading(false);
      setRoleLoading(false);
    }, 5000);

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSessionLoading(true);
      setRoleLoading(true);
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        await fetchRole(u.id);
      } else {
        setRole(null);
        setIsAdmin(false);
      }
      setSessionLoading(false);
      setRoleLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  async function fetchRole(userId: string) {
    setRoleLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      setRole((data?.role as UserRole) ?? null);

      // is_admin is added by a later migration; if the column is missing,
      // do not fail the role lookup because of it.
      const { data: adminData, error: adminError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();
      if (adminError) {
        console.warn('is_admin column not available, defaulting to false:', adminError.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(adminData?.is_admin ?? false);
      }
    } catch (err) {
      console.error('fetchRole error:', err);
      setRole(null);
      setIsAdmin(false);
    } finally {
      setRoleLoading(false);
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
