import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  Group,
  Card,
  Button,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import apiClient from "../api/axios";

const TripCard = ({
  onCardClick,
  onDelete,
  trip,
  userId,
  onSaveToggle,
  canDelete,
}) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (trip.savedByUsers && userId) {
      const isSaved = trip.savedByUsers.some((user) => user.id === userId);
      setIsHeartFilled(isSaved);
    }
  }, [trip.savedByUsers, userId]);

  const toggleHeart = async (event) => {
    event.stopPropagation();
    if (isToggling) return;
    console.log(
      `Attempting to toggle save for tripId: ${trip.id} by userId: ${userId}`
    );

    if (!userId) {
      console.error("Cannot toggle save: No userId provided to TripCard.");
      return;
    }

    setIsToggling(true);
    const previousHeartState = isHeartFilled;
    setIsHeartFilled(!previousHeartState);

    try {
      await apiClient.post(`/trips/${trip.id}/toggle-save`);

      if (onSaveToggle) {
        onSaveToggle();
      }
    } catch (error) {
      console.error("Error toggling save status. Full error object:", error);

      setIsHeartFilled(previousHeartState);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(trip.id);
    }
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
          alt={trip.title || "Trip image"}
        />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{trip.title}</Text>
        <ActionIcon
          variant="transparent"
          onClick={toggleHeart}
          aria-label="Toggle favorite"
          disabled={isToggling || !userId}
        >
          {isHeartFilled ? (
            <IconHeartFilled
              size={30}
              color={theme.colors["custom-palette"][2]}
            />
          ) : (
            <IconHeart size={30} color={theme.colors["custom-palette"][2]} />
          )}
        </ActionIcon>
      </Group>
      <Group justify="space-between" mt="md" mb="xs">
        <Text size="sm" c="dimmed">
          Hosted By: {trip.host?.name || "Unknown"}
        </Text>
        {!canDelete && (
          <Text size="sm" c="dimmed">
            {formatDate(trip.startTime)}
          </Text>
        )}
      </Group>
      <Group justify="space-between" align="center">
        {canDelete && <Text>Status: {trip.status}</Text>}
        {canDelete && trip.status === "PLANNING" && (
          <Button onClick={handleDelete} color="red" size="xs" variant="light">
            Delete Trip
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default TripCard;
