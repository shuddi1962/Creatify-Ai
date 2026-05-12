'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  adminRole: null,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
  refreshAdminRole: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminRole, setAdminRole] = useState(null);

  const fetchAdminRole = useCallback(async (userId) => {
    if (!userId) { setAdminRole(null); return; }
    try {
      const { data } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      setAdminRole(data?.role || null);
    } catch {
      setAdminRole(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchAdminRole(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchAdminRole(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchAdminRole]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.user) fetchAdminRole(data.user.id);
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signInWithOAuth = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setAdminRole(null);
    if (error) throw error;
  };

  const refreshAdminRole = useCallback(async () => {
    if (user) await fetchAdminRole(user.id);
  }, [user, fetchAdminRole]);

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      adminRole,
      isAdmin: !!adminRole,
      signIn, signUp, signInWithOAuth, signOut, refreshAdminRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
