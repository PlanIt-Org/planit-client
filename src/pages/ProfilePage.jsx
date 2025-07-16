import React from "react";
import { UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mantine/core";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <Container
      h="100vh"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UserProfile />
    </Container>
  );
};

export default ProfilePage;
