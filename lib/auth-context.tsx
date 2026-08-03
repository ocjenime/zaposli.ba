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
    const ROLE_KEY = 'zaposli_role';
    const ADMIN_KEY = 'zaposli_is_admin';

    async function init() {
      setSessionLoading(true);
      setRoleLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const u = data.session?.user ?? null;
        setUser(u);
        if (u) {
          // Use cached role immediately so role-dependent UIs don't flash
          const cachedRole = typeof window !== 'undefined' ? localStorage.getItem(ROLE_KEY) : null;
          if (cachedRole) {
            setRole(cachedRole as UserRole);
          }
          const cachedAdmin = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_KEY) : null;
          if (cachedAdmin !== null) {
            setIsAdmin(cachedAdmin === 'true');
          }
          await fetchRole(u.id);
        } else {
          setRole(null);
          setIsAdmin(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(ROLE_KEY);
            localStorage.removeItem(ADMIN_KEY);
          }
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
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ROLE_KEY);
          localStorage.removeItem(ADMIN_KEY);
        }
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
      const resolvedRole = (data?.role as UserRole) ?? null;
      setRole(resolvedRole);
      if (typeof window !== 'undefined') {
        if (resolvedRole) {
          localStorage.setItem('zaposli_role', resolvedRole);
        } else {
          localStorage.removeItem('zaposli_role');
        }
      }

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
        if (typeof window !== 'undefined') localStorage.removeItem('zaposli_is_admin');
      } else {
        const resolvedAdmin = adminData?.is_admin ?? false;
        setIsAdmin(resolvedAdmin);
        if (typeof window !== 'undefined') {
          localStorage.setItem('zaposli_is_admin', String(resolvedAdmin));
        }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zaposli_role');
      localStorage.removeItem('zaposli_is_admin');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
