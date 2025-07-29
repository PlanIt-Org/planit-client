// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import {
  Container,
  Button,
  Stack,
  TextInput,
  Title,
  Paper,
  Divider,
  Anchor,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { supabase } from "../supabaseClient";
import apiClient from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/questionnaire`,
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

    try {
      const response = await apiClient.post("/users/create", {
        email: email,
        password: password,
        name: username,
      });
      notifications.show({
        title: "Success!",
        message: "Please check your email for a verification link.",
        color: "green",
      });
      console.log("User created:", response.data);

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              display_name: username,
            },
          },
        });

      if (signUpError) {
        throw new Error(
          `Sign-in failed after registration: ${signUpError.message}`
        );
      }

      console.log("Sign-in successful, navigating to questionnaire...");
      navigate("/questionnaire"); // <-- not working
    } catch (error) {
      notifications.show({
        title: "Registration Error",
        message: error.response?.data?.message || "An unknown error occurred.",
        color: "red",
      });
      console.error(
        "Error signing up:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
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
                label="Username"
                placeholder="Your username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
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
          <Divider label="or" labelPosition="center" my="lg" />
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
        <Text ta="center" mt="md">
          Don't have an account?{" "}
          <Anchor
            component={Link}
            to="/login"
            underline="always"
            fw={700}
            c="blue"
          >
            Login
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
