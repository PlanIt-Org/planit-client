// src/context/AuthContext.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./authContext";
import apiClient from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.access_token) {
          console.log("User signed in, passing token directly to backend...");
          try {
            await apiClient.post(
              "/users/ensure-profile",
              {},
              {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              }
            );
            console.log("Backend profile successfully synced.");
          } catch (error) {
            console.error(
              "CRITICAL: Failed to sync user profile with backend.",
              error.response?.data?.message || error.message
            );
          }
        }

        setSession(session);
        if (loading) setLoading(false);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const value = { session, user: session?.user, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
