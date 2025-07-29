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
  ActionIcon,
} from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useState } from "react";
// No longer need to import api or notifications here
// We also remove the useDeleteTrip hook from the child component
const TripCard = ({ onCardClick, onDelete, trip }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  // The useDeleteTrip hook is removed from here.
  const toggleHeart = (event) => {
    event.stopPropagation();
    setIsHeartFilled((prev) => !prev);
  };
  // This is the key change. This function now simply calls the 'onDelete'
  // function that was passed down as a prop from the TripGrid component.
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
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
            trip.locations?.[0]?.image ||
            "https://images.unsplash.com/photo-1499591934245-40b55745b905?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          height={160}
          alt="Title of the trip"
        />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{trip.title}</Text>
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
      <Group justify="space-between" align="center">
        <Text>Status: {trip.status}</Text>
        {trip.status === "PLANNING" && (
          <Button onClick={handleDelete} color="red" size="xs" variant="light">
            Delete Trip
          </Button>
        )}
      </Group>
    </Card>
  );
};
export default TripCard;
