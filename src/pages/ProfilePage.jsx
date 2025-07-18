import React from "react";
import { UserProfile } from "@clerk/clerk-react";
import { Container } from "@mantine/core";

const ProfilePage = () => {

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
