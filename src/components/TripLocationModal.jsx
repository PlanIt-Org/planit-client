import React from "react";
import {
  Modal,
  Image,
  Box,
  Group,
  Title,
  Text,
  Stack,
  Divider,
  Avatar,
  Paper,
} from "@mantine/core";

const TripLocationModal = ({ opened, close, location, comments }) => {
  if (!location) return null;

  const filteredComments = comments.filter(
    (comment) =>
      comment.location.trim().toLowerCase() ===
      location.name.trim().toLowerCase()
  );

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      centered
      withCloseButton
      overlayProps={{ backgroundOpacity: 0.7, blur: 2 }}
      title={
        <Title order={2} fw={700}>
          {location.name}
        </Title>
      }
      styles={(theme) => ({
        content: {
          borderRadius: theme.radius.md,
        },
        header: {
          padding: theme.spacing.md,
          paddingBottom: 0,
        },
        body: {
          padding: theme.spacing.md,
        },
      })}
    >
      <Stack spacing="md">
        {/* Image Section */}
        <Image
          src={
            location.imageUrl ||
            `https://picsum.photos/600/300?random=${location.name}`
          }
          alt={location.name}
          fit="cover"
          height={250} // Adjusted height for a more balanced look
          radius="md"
        />

        {/* Info Section */}
        <Box>
          <Text size="sm" c="dimmed">
            {location.formatted_address}
          </Text>
        </Box>

        <Divider my="sm" />

        {/* Comments Section */}
        <Stack spacing="md">
          <Title order={4}>Comments</Title>
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <Paper key={comment.id} p="sm" withBorder radius="md">
                <Group>
                  <Avatar
                    src={
                      comment.author?.avatar ||
                      `https://i.pravatar.cc/150?img=${comment.id}`
                    }
                    alt={comment.author?.name || "Unknown"}
                    radius="xl"
                  />
                  <div>
                    <Text size="sm" fw={500}>
                      {comment.author?.name || "Unknown"}
                    </Text>
                    <Text size="sm" mt={4}>
                      {comment.text}
                    </Text>
                  </div>
                </Group>
              </Paper>
            ))
          ) : (
            <Text c="dimmed" ta="center">
              No comments yet for this location.
            </Text>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};

export default TripLocationModal;
