import React, { useState } from "react";
import {
  Container,
  Button,
  Stack,
  TextInput,
  Title,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // This handler is for OAuth providers (Google, GitHub, etc.)
  const handleLogin = async (provider, credentials) => {
    setLoading(true);
    const { error } = provider
      ? await supabase.auth.signInWithOAuth({ provider })
      : await supabase.auth.signInWithPassword(credentials);

    if (error) {
      notifications.show({
        title: "Login Error",
        message: error.message,
        color: "red",
      });
    }
    // On success, the onAuthStateChange listener in AuthProvider will handle everything.
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
        radius="md"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <Title align="center" order={2} mb="lg">
          Welcome Back!
        </Title>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(null, { email, password });
          }}
        >
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="you@youremail.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <TextInput
              required
              label="Password"
              placeholder="Your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button type="submit" fullWidth mt="md" loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>
        <Button
          onClick={() => handleLogin("google")}
          variant="default"
          fullWidth
          mt="md"
          loading={loading}
        >
          Sign in with Google
        </Button>
        <Button
          onClick={() => handleLogin("github")}
          variant="default"
          fullWidth
          mt="sm"
          loading={loading}
        >
          Sign in with GitHub
        </Button>
      </Paper>
    </Container>
  );
};

export default LoginPage;
