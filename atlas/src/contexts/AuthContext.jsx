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
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
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

  return { data: data[0], error: null };
};

const updatePlan = async (json, id) => {
  const {error} = await supabase
    .from("plan")
    .update({data: json})
    .eq('id', id)
  return {error};
}

const deletePlan = async (id) => {
  // First delete all relationships pointing to this plan
  const { error: relError } = await supabase
    .from('relationship')
    .delete()
    .eq('plan', id);
  
  if (relError) {
    console.error('Error deleting relationships:', relError);
    return { error: relError };
  }

  // Delete the plan
  const { error } = await supabase
    .from('plan')
    .delete()
    .eq('id', id);
  
  return { error };
};

const getUserRecord = async () => {
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) return null;

  const authId = authData.user.id;

  const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('auth_id', authId)
      .single();

  if (error) {
      console.error("Error fetching user row:", error);
      return null;
  }

  return data;
};

  // const getPlanID = async () => {

  //   const { data, error } = await supabase
  //     .from('plan')
  //     .select('id')
  //     .order('id', { ascending: false })
  //     .limit(1)
  //     .single();


  //   if (error) {
  //       console.error("Error fetching plan:", error);
  //       return null;
  //   }

  //   return data;
  // };

const createRelationship = async (user, plan, role) => {
const { data, error } = await supabase
  .from('relationship')
  .insert([
    { user: user, plan: plan, relationship: role },
  ])
  .select()



  if (error) {
      console.error("Error fetching plan:", error);
      return null;
  }

  return data;
};

const getUserPlans = async () => {
  const userRecord = await getUserRecord();
  if (!userRecord) return { data: null, error: new Error("No user") };

  // Get relationships first
  const { data: relationships, error: relError } = await supabase
    .from('relationship')
    .select('plan, relationship')
    .eq('user', userRecord.id);

  if (relError) return { data: null, error: relError };

  // Get plan details for each relationship
  const planIds = relationships.map(r => r.plan);
  const { data: planData, error: planError } = await supabase
    .from('plan')
    .select('*')
    .in('id', planIds);

  if (planError) return { data: null, error: planError };

  // Combine the data with formatted dates
  const plans = planData.map(plan => {
    const rel = relationships.find(r => r.plan === plan.id);
    const date = new Date(plan.created_at);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return {
      id: plan.id,
      title: plan.data?.title || 'Untitled',
      createdAt: formattedDate,
      lastModified: formattedDate,
      owner: rel.relationship === 'owner' ? 'me' : 'shared',
      relationship: rel.relationship
    };
  });

  return { data: plans, error: null };
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
    createPlan,
    updatePlan,
    deletePlan,
    getUserRecord,
    //getPlanID,
    createRelationship,
    getUserPlans
};
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
  
