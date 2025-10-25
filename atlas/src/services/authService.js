import { supabase } from './supabaseClient';

export async function loginWithEmail(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function registerUser(email, password, userData) {
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  });
}

export async function logoutUser() {
  return await supabase.auth.signOut();
}

export async function sendPasswordReset(email) {
  return await supabase.auth.resetPasswordForEmail(email);
}