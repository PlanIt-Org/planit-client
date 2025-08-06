import React, { useState } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { notifications } from "@mantine/notifications";

const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // 1. Sign the user out from Supabase. This clears the session.
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // 2. Navigate the user to the login page.
      // This is a cleaner way to reset the app's state, as it allows
      // React's context and routing to handle the session change gracefully.
      navigate("/login");
      
    } catch (error) {
      notifications.show({
        title: "Logout Failed",
        message: error.message || "An unexpected error occurred.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="gradient"
      gradient={{ from: "red", to: "orange" }}
      fullWidth
      loading={isLoading}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
