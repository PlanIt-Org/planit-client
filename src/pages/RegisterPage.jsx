// src/pages/RegisterPage.jsx
import React from "react";
import { Container } from "@mantine/core";
const signUpRedirectUrl = "http://localhost:5173/questionnaire";

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
