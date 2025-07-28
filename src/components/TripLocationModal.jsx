import React from 'react';
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
} from '@mantine/core';

const TripLocationModal = ({ opened, open, close, location }) => {
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
        }
      })}
    >
      <Card radius="md" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Image Section */}
        <Card.Section>
          <Image
            src={location.imageUrl || `https://picsum.photos/600/300?random=${location.name}`}
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
        <Box p="md" pt="xs">
          <Title order={3} fw={600} mb="sm">Comments</Title>
          <Stack spacing="md">
            <Paper p="xs" withBorder radius="md">
              <Group wrap="nowrap" align="flex-start">
                <Avatar src="https://i.pravatar.cc/150?img=3" radius="xl" />
                <Box>
                  <Text fw={500} size="sm">John Doe</Text>
                  <Text size="sm" c="dimmed">
                    Beautiful spot! Would visit again.
                  </Text>
                  <Text size="xs" c="gray">2 hours ago</Text>
                </Box>
              </Group>
            </Paper>
          </Stack>
        </Box>
      </Card>
    </Modal>
  );
};

export default TripLocationModal;
