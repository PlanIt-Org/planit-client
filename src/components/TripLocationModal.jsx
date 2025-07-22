import React from 'react';
import {
  Modal,
  Container,
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
import { LoremIpsum } from 'react-lorem-ipsum'; 

const TripLocationModal = ({opened, close}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Location Details" // Updated title
      size="lg" // Occupy a decent amount of screen space
      centered
      withCloseButton={true} // Re-enabled default close button for simplicity
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 2,
      }}
      styles={(theme) => ({
        content: {
          backgroundColor: theme.colors.gray[0], // Light gray background
          color: theme.colors.dark[7], // Dark text color
          borderRadius: theme.radius.md,
          padding: 0, // Remove default padding for full-bleed image/sections
        },
        header: {
          paddingBottom: 0, // Adjust padding around the header
          paddingTop: theme.spacing.md,
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.md,
        },
        body: {
          padding: theme.spacing.md, // Add padding to the body of the modal
          paddingTop: 0,
        }
      })}
    >
      <Card radius="md" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Top Portion: Image */}
        <Card.Section>
          <Image
            src="https://unsplash.com/photos/eiffel-tower-paris-across-body-of-water-during-daytime-m-sVLnrjFxY" // Hardcoded image: Eiffel Tower
            alt="Hardcoded Location Image"
            fit="cover"
            height={250} // Fixed height for the image banner
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          />
        </Card.Section>

        {/* Middle Portion: Title, Description, Address */}
        <Box p="md">
          <Stack spacing="xs">
            <Title order={2} fw={700}>
              Hardcoded Location Title
            </Title>
            <Text size="sm" c="dimmed">
              Hardcoded Description: <LoremIpsum avgWordsPerSentence={8} p={1} />
            </Text>
            <Text size="sm" c="dimmed">
              **Address:** 123 Hardcoded Street, City, Country
            </Text>
          </Stack>
        </Box>

        <Divider my="sm" /> {/* Visual separator */}

        {/* Bottom Portion: Comments Section */}
        <Box p="md" pt="xs"> {/* Adjusted padding for comments section */}
          <Title order={3} fw={600} mb="sm">Comments</Title>
          <Stack spacing="md">
            {/* Hardcoded Comment 1 */}
            <Paper p="xs" withBorder radius="md">
              <Group wrap="nowrap" align="flex-start">
                <Avatar src="https://i.pravatar.cc/150?img=3" alt="Commenter Avatar 1" radius="xl" />
                <Box>
                  <Text fw={500} size="sm">John Doe</Text>
                  <Text size="sm" c="dimmed">
                    <LoremIpsum avgWordsPerSentence={10} p={1} />
                  </Text>
                  <Text size="xs" c="gray">2 hours ago</Text>
                </Box>
              </Group>
            </Paper>

            {/* Hardcoded Comment 2 */}
            <Paper p="xs" withBorder radius="md">
              <Group wrap="nowrap" align="flex-start">
                <Avatar src="https://i.pravatar.cc/150?img=4" alt="Commenter Avatar 2" radius="xl" />
                <Box>
                  <Text fw={500} size="sm">Jane Smith</Text>
                  <Text size="sm" c="dimmed">
                    <LoremIpsum avgWordsPerSentence={12} p={1} />
                  </Text>
                  <Text size="xs" c="gray">Yesterday</Text>
                </Box>
              </Group>
            </Paper>
          </Stack>
        </Box>
      </Card>
    </Modal>
  )
}

export default TripLocationModal