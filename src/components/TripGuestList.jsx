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

  const renderContent = () => {
    if (loading) {
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
          {attendees.map((rsvp) => {
            const user = rsvp.user;
            return <GuestAvatar key={user.id} user={user} />;
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
        <Group>
          <Text fw={500}>Guest List</Text>
          {counts.going > 0 && (
            <Badge size="sm" color="green" variant="light">
              {counts.going} going
            </Badge>
          )}
        </Group>
        {renderContent()}
      </Stack>
    </Card>
  );
};

// Separate component to handle individual guest avatars with profile picture logic
const GuestAvatar = ({ user }) => {
  const { getCurrentAvatarUrl } = useProfilePicture(user);

  const avatarUrl = getCurrentAvatarUrl();
  const displayName = user.name || user.email?.split("@")[0] || "User";

  return (
    <Tooltip label={displayName} withArrow>
      <Avatar src={avatarUrl} alt={displayName} radius="xl" size="md" />
    </Tooltip>
  );
};

export default TripGuestList;
