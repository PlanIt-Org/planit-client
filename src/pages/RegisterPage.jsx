// src/pages/RegisterPage.jsx
import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { Container } from "@mantine/core";
const signUpRedirectUrl = import.meta.env.VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL;

const RegisterPage = () => {
  return (
    <Container
      h="100vh"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SignUp forceRedirectUrl={signUpRedirectUrl} />
    </Container>
  );
};

export default RegisterPage;
