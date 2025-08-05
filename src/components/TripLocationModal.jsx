import React from "react";
import {
  Modal,
  Card,
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

const TripLocationModal = ({ opened, open, close, location, comments }) => {
  if (!location) return null;

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      centered
      withCloseButton
      overlayProps={{ backgroundOpacity: 0.7, blur: 2 }}
      styles={(theme) => ({
        content: {
          backgroundColor: theme.colors.gray[0],
          color: theme.colors.dark[7],
          borderRadius: theme.radius.md,
          padding: 0,
        },
        header: {
          paddingBottom: 0,
          paddingTop: theme.spacing.md,
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.md,
        },
        body: {
          padding: theme.spacing.md,
          paddingTop: 0,
        },
      })}
    >
      <Card radius="md" style={{ padding: 0, overflow: "hidden" }}>
        {/* Image Section */}
        <Card.Section>
          <Image
            src={
              location.imageUrl ||
              `https://picsum.photos/600/300?random=${location.name}`
            }
            alt={location.name}
            fit="cover"
            height={350}
          />
        </Card.Section>

        {/* Info Section */}
        <Box p="md">
          <Stack spacing="xs">
            <Title order={2} fw={700}>
              {location.name}
            </Title>
            <Text size="sm" c="dimmed">
              {location.formatted_address}
            </Text>
          </Stack>
        </Box>

        <Divider my="sm" />

        {/* Comments */}
        <Stack spacing="md" mt="md">
          {(() => {
            const filteredComments = comments.filter(
              (comment) =>
                comment.location.trim().toLowerCase() ===
                location.name.trim().toLowerCase()
            );

            if (filteredComments.length > 0) {
              return filteredComments.map((comment) => (
                <Paper key={comment.id} p="sm" withBorder radius="md">
                  <Group>
                    <Avatar
                      src={
                        comment.author?.avatar ||
                        "https://i.pravatar.cc/150?img=0"
                      }
                      alt={comment.author?.name || comment.author?.email || "Guest"}
                      radius="xl"
                    />
                    <div>
                      <Text size="sm" fw={500}>
                      {comment.author?.name || comment.author?.email || "Guest"}
                      </Text>
                      {comment.location?.length > 0 && (
                        <Text size="xs" c="dimmed">
                          on {comment.location}
                        </Text>
                      )}
                      <Text size="sm" mt={4}>
                        {comment.text}
                      </Text>
                    </div>
                  </Group>
                </Paper>
              ));
            } else {
              // If the filtered array is empty, show the "No comments" message just once.
              return (
                <Text c="dimmed" ta="center">
                  No comments yet for this location
                </Text>
              );
            }
          })()}
        </Stack>
      </Card>
    </Modal>
  );
};

export default TripLocationModal;
