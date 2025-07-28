import { useState } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";

const LogoutButton = () => {
  const { session, setSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // if (!user) return;

    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await apiClient.post(
          "/users/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setSession(null);
      await supabase.auth.signOut();
      navigate("/login");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="light"
      color="red"
      fullWidth
      onClick={handleLogout}
      loading={isLoading}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
