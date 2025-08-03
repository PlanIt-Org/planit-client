import React from "react";
import {
  Card,
  Stack,
  Text,
  Paper,
  Group,
  Avatar,
  Loader,
  Tooltip,
  Badge,
} from "@mantine/core";
import useTripRSVPs from "../hooks/useTripRSVPs";
import { useProfilePicture } from "../hooks/useProfilePicture";

const TripGuestList = ({ tripId }) => {
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
      <div>
        {" "}
        <Group justify="center" mb="xs"></Group>
        <Paper p="xs" withBorder>
          <Group justify="center">
            {attendees.map((user) => (
              <GuestAvatar key={user?.id} user={user} />
            ))}
          </Group>
        </Paper>
      </div>
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
        <Group>
          <Text fw={500}>Guest List</Text>
          {counts.going > 0 && (
            <Badge size="sm" color="green" variant="light">
              {counts.going + 1} going
            </Badge>
          )}
        </Group>
        {renderContent()}
      </Stack>
    </Card>
  );
};

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
