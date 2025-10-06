import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = React.createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState()
  const [profile, setProfile] = useState()
  const [isLoading, setIsLoading] = useState(true)
  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        console.error('Error fetching session:', error)
      }
      setSession(session)
      setIsLoading(false)
    }
    fetchSession()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { event: _event, session })
      setSession(session)
    })
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  // Fetch the profile when the session changes
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (error){
            console.error('Error fetching profile:', error)
        }
        setProfile(data)
      } else {
        setProfile(null)
      }
    }
    fetchProfile()
  }, [session])
  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        isLoggedIn: session != undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordWithEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return { data, error };
  };