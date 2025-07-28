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
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
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
          src={
            trip.tripImage ||
            "https://images.unsplash.com/photo-1499591934245-40b55745b905?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
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
          Hosted By {trip.host.name}
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
