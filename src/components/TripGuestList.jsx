import React, { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Text,
  Paper,
  Group,
  Avatar,
  Loader,
  Tooltip,
} from "@mantine/core";
import apiClient from "../api/axios";

const TripGuestList = ({ tripId }) => {
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if there's no tripId
    if (!tripId) {
      setIsLoading(false);
      return;
    }

    const fetchAttendees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/trip/${tripId}/attendees`);
        setAttendees(response.data);
      } catch (err) {
        console.error(
          "[TripGuestList] Failed to fetch attendees:",
          err.response?.data || err.message
        );
        setError("Could not load the guest list.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendees();
  }, [tripId]);

  const renderContent = () => {
    if (isLoading) {
      return <Loader size="sm" />;
    }

    if (error) {
      return (
        <Text color="red" size="sm">
          {error}
        </Text>
      );
    }

    if (attendees.length === 0) {
      return (
        <Text size="sm" c="dimmed">
          No confirmed guests yet.
        </Text>
      );
    }

    return (
      <Paper p="xs" withBorder>
        <Group justify="center">
          {attendees.map((user, index) => (
            <Tooltip key={user.id} label={user.name} withArrow>
              <Avatar
                src={
                  user.avatarUrl || `https://i.pravatar.cc/150?img=${index + 1}`
                }
                alt={user.name}
                radius="xl"
              />
            </Tooltip>
          ))}
        </Group>
      </Paper>
    );
  };

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        background: "#f3f4f6",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
      }}
    >
      <Stack align="center">
        <Text fw={500}>Guest List</Text>
        {renderContent()}
      </Stack>
    </Card>
  );
};

export default TripGuestList;
