import { supabase } from "../../supabaseClient";

// Sign Up
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Sign-up error:", error.message);
    return { data: null, error };
  }
};

// Log In
export const logIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Login error:", error.message);
    return { data: null, error };
  }
};

// Log Out
export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return null;
  } catch (error) {
    console.error("Logout error:", error.message);
    return error;
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Get current user error:", error.message);
    return { data: null, error };
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Forgot Password error:", error.message);
    return { data: null, error };
  }
};
