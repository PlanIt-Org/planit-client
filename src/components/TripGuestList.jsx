import React from "react";
import {
  Card,
  Stack,
  Text,
  Group,
  Avatar,
  Loader,
  Tooltip,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import useTripRSVPs from "../hooks/useTripRSVPs";
import { useProfilePicture } from "../hooks/useProfilePicture";

const TripGuestList = ({ tripId }) => {
  const theme = useMantineTheme();
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
      <Group justify="center" mt="xs">
        {attendees.map((user) => (
          <GuestAvatar key={user?.id} user={user} />
        ))}
      </Group>
    );
  };

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        background: theme.colors["custom-palette"][8],
        borderRadius: 8,
      }}
    >
      <Stack align="center">
        <Group>
          <Text fw={500}>Guest List:</Text>
          {counts.going > 0 && (
            <Badge
              size="sm"
              color="green"
              variant="light"
              style={{ fontWeight: 700, letterSpacing: 0.5 }}
            >
              {counts.going} <span style={{ fontWeight: 900 }}>going</span>
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

  return (
    <Tooltip label={displayName} withArrow>
      <Avatar src={avatarUrl} alt={displayName} radius="xl" size="md" />
    </Tooltip>
  );
};

export default TripGuestList;
