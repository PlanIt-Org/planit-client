// src/pages/LoginPage.jsx
import React from "react";
import { Container } from "@mantine/core";
const signInRedirectUrl = "http://localhost:5173/home";

const LoginPage = () => {
  return (
    <Container
      h="100vh"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SignIn forceRedirectUrl={signInRedirectUrl} />
    </Container>
  );
};

export default LoginPage;
