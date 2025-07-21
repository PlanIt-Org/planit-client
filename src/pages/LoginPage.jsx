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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // This handler is for OAuth providers (Google, GitHub, etc.)
  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
    if (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
    }
    setLoading(false);
  };

  const handleEmailPasswordLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
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
            Welcome Back!
          </Title>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailPasswordLogin}>
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
                Sign in with Email
              </Button>
            </Stack>
          </form>

          {/* OAuth Buttons */}
          <Button
            onClick={() => handleOAuthLogin("google")}
            variant="default"
            fullWidth
            loading={loading}
          >
            Sign in with Google
          </Button>
          <Button
            onClick={() => handleOAuthLogin("github")}
            variant="default"
            fullWidth
            loading={loading}
          >
            Sign in with GitHub
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;
