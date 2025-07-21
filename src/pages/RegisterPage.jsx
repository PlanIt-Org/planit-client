// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import {
  Container,
  Button,
  Stack,
  TextInput,
  Title,
  Paper,
} from "@mantine/core";
import { supabase } from "../supabaseClient";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: "http://localhost:5173/questionnaire",
      },
    });
    if (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
    setLoading(false);
  };

  const handleEmailPasswordSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "http://localhost:5173/home",
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    } else {
      alert(
        "Registration successful! Please check your email to confirm your account."
      );
    }
    setLoading(false);
  };

  return (
    <Container
      h="100vh"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <Stack>
          <Title align="center" order={2}>
            Create an Account
          </Title>

          <form onSubmit={handleEmailPasswordSignUp}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="you@youremail.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
              <TextInput
                required
                label="Password"
                placeholder="Your password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
              <Button type="submit" fullWidth mt="xl" loading={loading}>
                Sign up with Email
              </Button>
            </Stack>
          </form>

          <Button
            onClick={() => handleOAuthLogin("google")}
            variant="default"
            fullWidth
            loading={loading}
          >
            Sign up with Google
          </Button>
          <Button
            onClick={() => handleOAuthLogin("github")}
            variant="default"
            fullWidth
            loading={loading}
          >
            Sign up with GitHub
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
