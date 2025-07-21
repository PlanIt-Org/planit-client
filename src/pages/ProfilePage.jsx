import React from "react";
import { UserProfile } from "@clerk/clerk-react";
import { Container, Flex, Box } from "@mantine/core";
import NavBar from "../components/NavBar";

const ProfilePage = () => {
  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar currentPage={3} />
      {/* main content */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: 20,
          boxSizing: "border-box",
        }}
      >
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
      </Box>
    </Flex>
  );
};

export default ProfilePage;
