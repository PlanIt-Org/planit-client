import React, { useState } from "react";
import {
  Container,
  Button,
  Stack,
  TextInput,
  Title,
  Paper,
  Text,
  Anchor,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { supabase } from "../supabaseClient.js";
import { useNavigate, Link } from "react-router-dom";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const AnimatedContainer = styled(Container)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors["custom-palette"][7]};
  animation: ${fadeIn} 0.7s ease;
`;

const AnimatedPaper = styled(Paper)`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors["custom-palette"][8]};
  animation: ${fadeIn} 0.9s cubic-bezier(0.4, 0, 0.2, 1);
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useMantineTheme();

  // This handler is for OAuth providers (Google, GitHub, etc.)
  const handleLogin = async (provider, credentials) => {
    setLoading(true);

    if (provider) {
      // console.log(`Attempting OAuth login with provider: ${provider}`);
      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider,
      //   options: {
      //     redirectTo: `${window.location.origin}/home`,
      //   },
      // });

      // if (error) {
      //   notifications.show({
      //     title: "Login Error",
      //     message: error.message,
      //     color: "red",
      //   });
      //   console.error(`OAuth login failed for provider: ${provider}`, error);
      //   setLoading(false);
      // }
    } else {
      console.log("Attempting password login with credentials.");
      const { error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        notifications.show({
          title: "Login Error",
          message: error.message,
          color: "red",
        });
        console.error("Password login failed", error);
      } else {
        console.log("Password login successful");
        navigate("/home");
      }
      setLoading(false);
    }
  };

  return (
    <AnimatedContainer theme={theme}>
      <AnimatedPaper withBorder shadow="md" p={30} radius="md" theme={theme}>
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
        </form>{" "}
        {/* <Divider label="or" labelPosition="center" my="lg" />
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
        </Button> */}
        <Text ta="center" mt="md">
          Don't have an account?{" "}
          <Anchor
            component={Link}
            to="/register"
            underline="always"
            fw={700}
            c="blue"
          >
            Register
          </Anchor>
        </Text>
      </AnimatedPaper>
    </AnimatedContainer>
  );
};

export default LoginPage;
