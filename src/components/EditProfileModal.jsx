import { useState } from "react";
import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import apiClient from "../api/axios";

const EditProfileModal = ({
  currentDisplayName,
  onClose,
  refreshUserInfo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: {
      displayName: currentDisplayName || "",
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
    setError(null);
    try {
      // This now calls your new, dedicated endpoint for updating the username.
      await apiClient.put("/users/username", { displayName: values.displayName });

      notifications.show({
        title: "Success!",
        message: "Your display name has been updated.",
        color: "green",
      });

      if (refreshUserInfo) {
        await refreshUserInfo();
      }
      onClose();

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update display name.";
      setError(errorMessage);
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
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
          error={error || form.errors.displayName}
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
};

export default EditProfileModal;
