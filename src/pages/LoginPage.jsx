// src/pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Group,
  Checkbox,
  Alert,
  Button,
  Anchor,
} from "@mantine/core";

const LoginPage = () => {
  // Page-level state management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Page-level event handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      // Mock validation
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
      console.log("Login attempt:", formData);
      // In a real app, you would navigate to dashboard here
    }, 1000);
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack align="center" mb="md">
          <Title order={2} fw={700}>
            Welcome Back
          </Title>
          <Text c="dimmed" size="sm">
            Sign in to your account
          </Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
            />
            <Group justify="space-between" mt="xs">
              <Checkbox
                label="Remember me"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <Anchor href="#" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            {error && (
              <Alert color="red" variant="light" mt="sm">
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              mt="md"
              size="md"
            >
              Sign In
            </Button>
          </Stack>
        </form>
        <Text c="dimmed" size="sm" align="center" mt="md">
          Don't have an account?{" "}
          <Anchor href="/register" size="sm">
            Sign up
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default LoginPage;
