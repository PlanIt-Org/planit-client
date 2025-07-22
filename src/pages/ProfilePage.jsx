import React from "react";
import { Container, Flex, Box } from "@mantine/core";
import NavBar from "../components/NavBar";

const ProfilePage = ({setCurrTripId}) => {
  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar currentPage={3} setCurrTripId={setCurrTripId}/>
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
          <a href="/questionnaire" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                background: "#228be6",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Go to Questionnaire
            </button>
          </a>
        </Container>
      </Box>
    </Flex>
  );
};

export default ProfilePage;
