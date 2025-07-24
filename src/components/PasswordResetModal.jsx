import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Stack,
  PasswordInput,
  Text,
} from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import apiClient from "../api/axios";
import { useAuth } from "../context/AuthContext";

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
    let response;
    try {
      setIsLoading(true);
      setError("");
      response = await apiClient.post(
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
      onClose();
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
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
    </form>
  );
};

export default PasswordResetModal;
