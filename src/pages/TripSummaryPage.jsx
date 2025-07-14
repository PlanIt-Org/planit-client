import React from "react";
import {
  Grid,
  Stack,
  Paper,
  Text,
  Group,
  Button,
  Avatar,
  SimpleGrid,
  ThemeIcon,
  Card,
  MultiSelect,
} from "@mantine/core";

// https://pravatar.cc is a random avatar generator
const comments = [
  {
    name: "Josh",
    avatar: "https://i.pravatar.cc/150",
    text: "Let's go!",
  },
  {
    name: "Thomas",
    avatar: "https://i.pravatar.cc/150",
    text: "I won't be able to make it.",
  },
  {
    name: "Moosay",
    avatar: "https://i.pravatar.cc/150",
    text: "I think we should go to Chipotle instead.",
  },
];

const TripSummaryPage = () => {
  return (
    <Grid gutter="xl" className="p-4">
      {/* Left Column */}
      <Grid.Col span={{ base: 12, sm: 6, lg: 7 }}>
        <Stack spacing="xl">
          {/* Time Information */}
          <Paper withBorder radius="md" p="sm" className="bg-white">
            <Group position="apart">
              <Text size="sm" color="dimmed">
                Start Time:
              </Text>
              <Text size="sm" color="dimmed">
                End Time:
              </Text>
              <Text size="sm" color="dimmed">
                Estimated Total Time:
              </Text>
            </Group>
          </Paper>

          {/* Main Image/Map Placeholder */}
          <Paper
            withBorder
            radius="md"
            className="flex items-center justify-center bg-gray-100"
            style={{ height: "350px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={200}
              height={200}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-map"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
              <path d="M9 4v13" />
              <path d="M15 7v13" />
            </svg>{" "}
          </Paper>

          {/* Bottom Image Placeholders */}
          <SimpleGrid cols={3} spacing="md">
            {[1, 2, 3].map((item) => (
              <Paper
                key={item}
                withBorder
                radius="md"
                className="relative h-32 bg-gray-100 flex items-center justify-center"
                style={{ overflow: "hidden", padding: 0 }}
              >
                <img
                  src={`https://picsum.photos/1000?random=${item}`}
                  alt={`Trip image ${item}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                  }}
                />
                <ThemeIcon
                  variant="light"
                  size="lg"
                  className="absolute top-2 right-2"
                ></ThemeIcon>
                <Text
                  size="xs"
                  color="dimmed"
                  className="absolute bottom-2 left-2 bg-white/70 px-2 py-1 rounded"
                  style={{ zIndex: 1 }}
                >
                  Image {item}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Grid.Col>

      {/* Right Column */}
      <Grid.Col md={6} lg={5}>
        <Stack spacing="xl">
          {/* Trip Details Card */}
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Group position="right">
                <Button variant="light">Add Hosts</Button>
                <Button variant="filled" color="dark">
                  Leave Trip
                </Button>
              </Group>
              <div className="text-center py-4">
                <Text size="xl" weight={700}>
                  Title
                </Text>
                <Text mt="xs" color="dimmed">
                  Trip description
                </Text>
                <Text mt="xs" color="dimmed">
                  list of Invitees
                </Text>
              </div>
              <Button variant="light" fullWidth mt="md">
                Copy Link
              </Button>
            </Stack>
          </Card>

          {/* Comments Section */}
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack>
              <Group position="apart">
                <Text size="lg" weight={600}>
                  Comments
                </Text>
                <MultiSelect
                  label="Filter By"
                  placeholder="Pick value"
                  data={["Location", "Person"]}
                />
              </Group>
              <Stack spacing="md" mt="md">
                {comments.map((comment, index) => (
                  <Paper key={index} p="xs" withBorder radius="md">
                    <Group>
                      <Avatar
                        src={comment.avatar}
                        alt={comment.name}
                        radius="xl"
                      />
                      <div>
                        <Text size="sm" weight={500}>
                          {comment.name}
                        </Text>
                        <Text size="sm" color="dimmed">
                          {comment.text}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default TripSummaryPage;
