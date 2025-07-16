// src/pages/LoginPage.jsx
import React from "react";
import { Container } from "@mantine/core";
import { SignIn } from "@clerk/clerk-react";
const signInRedirectUrl = import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL;

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
