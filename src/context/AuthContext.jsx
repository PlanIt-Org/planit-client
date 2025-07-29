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
        console.log(
          `Auth state changed: ${event}`,
          session ? "Session exists" : "No session"
        );

        setSession(session);
        setLoading(false);

        if (event === "SIGNED_IN" && session?.access_token) {
          console.log("User signed in, syncing profile with backend...");

          // Add a small delay to ensure axios interceptor is ready
          setTimeout(async () => {
            try {
              // Let the axios interceptor handle the token automatically
              const response = await apiClient.post("/users/ensure-profile");
              console.log(
                "Backend profile successfully synced:",
                response.data
              );
            } catch (error) {
              console.error(
                "CRITICAL: Failed to sync user profile with backend.",
                error.response?.data?.message || error.message
              );

              // Log more details for debugging
              if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
              }
            }
          }, 100); // Small delay to ensure interceptor is ready
        }

        if (event === "SIGNED_OUT") {
          console.log("User signed out");
        }
      }
    );

    return () => {
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    session,
    user: session?.user,
    loading,
    isAuthenticated: !!session?.access_token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
