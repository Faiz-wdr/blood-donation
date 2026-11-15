import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { signInAdmin, signOutAdmin, verifyCurrentAdmin } from '../services/adminService.js';
import { AdminContext } from './AdminContext.js';

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const verified = await verifyCurrentAdmin();
        if (isMounted) {
          if (verified) {
            setAdminUser(verified.user);
            setAdminProfile(verified.adminProfile);
          } else {
            setAdminUser(null);
            setAdminProfile(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('[useAdmin] checkSession error:', err);
        if (isMounted) {
          setAdminUser(null);
          setAdminProfile(null);
          setLoading(false);
        }
      }
    }

    checkSession();

    // Listen for Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setAdminUser(null);
            setAdminProfile(null);
            setLoading(false);
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const verified = await verifyCurrentAdmin();
            if (isMounted) {
              if (verified) {
                setAdminUser(verified.user);
                setAdminProfile(verified.adminProfile);
              } else {
                setAdminUser(null);
                setAdminProfile(null);
              }
              setLoading(false);
            }
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    const result = await signInAdmin(email, password);
    if (result.success) {
      setAdminUser(result.user);
      setAdminProfile(result.adminProfile);
      return { success: true };
    } else {
      setAuthError(result.error);
      return { success: false, error: result.error };
    }
  };

  const logout = async () => {
    await signOutAdmin();
    setAdminUser(null);
    setAdminProfile(null);
  };

  const value = {
    adminUser,
    adminProfile,
    isAuthenticated: Boolean(adminUser && adminProfile),
    loading,
    authError,
    login,
    logout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

