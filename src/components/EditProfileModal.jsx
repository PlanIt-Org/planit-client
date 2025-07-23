import { useState } from "react";
import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import apiClient from "../api/axios";

function EditDisplayNameForm({
  currentDisplayName,
  onClose,
  onSubmit,
  refreshUserInfo,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      displayName: currentDisplayName,
    },
    validate: {
      displayName: (value) => {
        if (isNotEmpty("Display name is required.")(value) !== null) {
          return "Display name is required.";
        }
        if (
          hasLength(
            { min: 3, max: 30 },
            "Name must be between 3 and 30 characters."
          )(value) !== null
        ) {
          return "Name must be between 3 and 30 characters.";
        }
        if (value === currentDisplayName) {
          return "Please enter a new name.";
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put("/users/me", {
        displayName: values.displayName,
      });
      setUserInfo(response.data);
      if (refreshUserInfo) {
        await refreshUserInfo();
      }
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      console.error("Failed to update display name:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          withAsterisk
          label="Display Name"
          placeholder="Your new display name"
          data-autofocus
          {...form.getInputProps("displayName")}
        />

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
}

export default EditDisplayNameForm;
