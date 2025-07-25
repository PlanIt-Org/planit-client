import { useState } from "react";
import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import apiClient from "../api/axios";
import useUpdateDisplayName from "../hooks/useUpdateDisplayName";

const EditDisplayNameForm = ({
  currentDisplayName,
  onClose,
  onSubmit,
  refreshUserInfo,
}) => {
  const [updateDisplayName, { isLoading, error }] = useUpdateDisplayName();

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
    const result = await updateDisplayName(values.displayName);
    if (result.success) {
      if (refreshUserInfo) {
        await refreshUserInfo();
      }
      onClose();
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
          error={error}
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

export default EditDisplayNameForm;
