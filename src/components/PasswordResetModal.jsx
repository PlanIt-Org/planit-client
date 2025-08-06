import { useState } from "react";
import { Button, Group, Stack, PasswordInput, Text } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import apiClient from "../api/axios";

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedForm = styled.form`
  animation: ${slideIn} 0.4s ease-out forwards;
`;

const PasswordResetModal = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: hasLength(
        { min: 8 },
        "Password must be at least 8 characters long"
      ),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError("");
    try {
      // The axios interceptor automatically adds the user's auth token.
      const response = await apiClient.post(
        "/users/reset-password",
        { password: values.password }
      );
      onSuccess(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedForm onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <PasswordInput
          withAsterisk
          label="New Password"
          placeholder="••••••••"
          data-autofocus
          {...form.getInputProps("password")}
        />
        <PasswordInput
          withAsterisk
          label="Confirm Password"
          placeholder="••••••••"
          {...form.getInputProps("confirmPassword")}
        />
        {error && (
          <Text color="red" size="sm" mt="xs">
            {error}
          </Text>
        )}

        <Group position="right" mt="md">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Save Changes
          </Button>
        </Group>
      </Stack>
    </AnimatedForm>
  );
};

export default PasswordResetModal;
