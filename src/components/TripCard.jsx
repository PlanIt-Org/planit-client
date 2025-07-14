import React from "react";
import {
  Box,
  Image,
  Title,
  Text,
  Group,
  Stack,
  Card,
  Button,
} from "@mantine/core";
const TripCard = () => {
  const randomId = Math.floor(Math.random() * 10) + 10;
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={`https://picsum.photos/id/${randomId}/800/600`}
          height={160}
          alt="Title of the trip"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Title</Text>
      </Group>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="sm" c="dimmed">
          Host By User
        </Text>
        <Text size="sm" c="dimmed">
          Date
        </Text>
      </Group>
    </Card>
  );
};

export default TripCard;
