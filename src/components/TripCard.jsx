/* eslint-disable no-unused-vars */
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
  Modal,
  ActionIcon,
} from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useState } from "react";

const TripCard = ({ onCardClick, trip }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const toggleHeart = (event) => {
    event.stopPropagation();
    setIsHeartFilled((prev) => !prev);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={onCardClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Section>
        <Image
          src={trip.tripImage}
          height={160}
          alt="Title of the trip"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{trip.title}</Text>
        {/* Make the heart icon clickable with ActionIcon */}
        <ActionIcon
          variant="transparent"
          onClick={toggleHeart}
          aria-label="Toggle favorite"
        >
          {isHeartFilled ? (
            <IconHeartFilled size={30} color="red" />
          ) : (
            <IconHeart size={30} color="black" />
          )}
        </ActionIcon>
      </Group>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="sm" c="dimmed">
          Host By {trip.host.name}
        </Text>
        <Text size="sm" c="dimmed">
        {formatDate(trip.startTime)}
        </Text>
      </Group>
      <Text>Status: {trip.status}</Text>
    </Card>
  );
};

export default TripCard;
