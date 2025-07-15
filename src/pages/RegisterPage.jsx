// src/pages/RegisterPage.jsx
import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { Container } from "@mantine/core";

const RegisterPage = () => {
  return (
    <Container justify="center" align="center" h="100vh">
      <SignUp />
    </Container>
  );
};

export default RegisterPage;
