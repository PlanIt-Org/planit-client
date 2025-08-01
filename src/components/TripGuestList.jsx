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
import useTripRSVPs from "../hooks/useTripRSVPs"; // Correctly imported
import { useProfilePicture } from "../hooks/useProfilePicture";

const TripGuestList = ({ tripId }) => {
  // Correctly calls the hook
  const { attendees, counts, loading, error } = useTripRSVPs(tripId);

  console.debug("[TripGuestList] Rendered with tripId:", tripId);
  console.debug("[TripGuestList] attendees:", attendees);
  console.debug("[TripGuestList] counts:", counts);
  console.debug("[TripGuestList] loading:", loading, "error:", error);

  const renderContent = () => {
    if (loading) {
      console.debug("[TripGuestList] Loading state");
      return <Loader size="sm" />;
    }

    if (error) {
      console.error("[TripGuestList] Error:", error);
      return (
        <Text color="red" size="sm">
          {error}
        </Text>
      );
    }

    if (attendees.length === 0) {
      console.debug("[TripGuestList] No attendees");
      return (
        <Text size="sm" c="dimmed">
          No confirmed guests yet.
        </Text>
      );
    }

    console.debug("[TripGuestList] Rendering attendees:", attendees);
    return (
      <Paper p="xs" withBorder>
        <Group justify="center">
          {/* Correctly maps over the 'attendees' array */}
          {attendees
            .filter((rsvp) => rsvp.user)
            .map((rsvp) => {
              // Correctly accesses the nested 'user' object
              const user = rsvp.user;
              console.debug(
                "[TripGuestList] Rendering GuestAvatar for user:",
                user
              );
              return <GuestAvatar key={user?.id} user={user} />;
            })}
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

// This child component is also correct
const GuestAvatar = ({ user }) => {
  const { getCurrentAvatarUrl } = useProfilePicture(user);

  const avatarUrl = getCurrentAvatarUrl();
  const displayName =
    user?.user_metadata?.display_name || user.email?.split("@")[0] || "User";

  console.debug("[GuestAvatar] Rendered for user:", user);
  console.debug(
    "[GuestAvatar] avatarUrl:",
    avatarUrl,
    "displayName:",
    displayName
  );

  return (
    <Tooltip label={displayName} withArrow>
      <Avatar src={avatarUrl} alt={displayName} radius="xl" size="md" />
    </Tooltip>
  );
};

export default TripGuestList;
