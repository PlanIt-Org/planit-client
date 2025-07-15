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
  Modal
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const TripCard = ({onCardClick}) => {
  const randomId = Math.floor(Math.random() * 10) + 10;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder onClick={onCardClick} style={{ cursor: 'pointer' }} >
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
