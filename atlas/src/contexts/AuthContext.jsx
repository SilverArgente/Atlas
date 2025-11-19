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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, first, last) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
  
    if (authError) return { data: null, error: authError };
  
    const user = authData.user;
    if (!user) return { data: null, error: new Error("No auth user returned")};
  
  
    const { data: insertData, error: insertError } = await supabase
      .from("user")
      .insert([
        {
          auth_id: user.id,
          email: email,
          first_name: first,
          last_name: last
        }
      ])
      .select();
  
    return { data: insertData, error: insertError };
  };

const createPlan = async (json) => {

  const { data, error } = await supabase
    .from("plan")
    .insert([
      {
        data: json,
      }
    ])
    .select();

  return { data, error };
};

const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};


const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordWithEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
  };
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    createPlan
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
  
