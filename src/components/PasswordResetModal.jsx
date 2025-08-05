import { useState } from "react";
import { Button, Group, Stack, PasswordInput, Text } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth";

// --- Emotion Animations & Styled Components ---

// 1. A keyframe animation for the form to slide in from the bottom.
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 2. Style the form element to apply the animation.
const AnimatedForm = styled.form`
  animation: ${slideIn} 0.4s ease-out forwards;
`;

const PasswordResetModal = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { session } = useAuth();
  const accessToken = session?.access_token;

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
    try {
      setIsLoading(true);
      setError("");
      const response = await apiClient.post(
        "/users/reset-password",
        { password: values.password },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("🚀 ~ handleSubmit ~ response.data:", response.data);
      onSuccess(response.data);
      // No need to call onClose here, it should be handled by the parent component (ProfileCard)
    } catch (err) {
      console.error("❌ API call failed! Error object:", err);
      const message =
        err.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use the new AnimatedForm component
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
