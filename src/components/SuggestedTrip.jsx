// src/components/SuggestedTrip.jsx
import React from "react";
import {
  Paper,
  Text,
  Group,
  Badge,
  Stack,
  ThemeIcon,
  List,
} from "@mantine/core";
import { IconMapPin, IconClock, IconBulb } from "@tabler/icons-react";

const SuggestedTrip = ({ trip }) => {
  if (!trip) {
    return null;
  }

  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      sx={(theme) => ({
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows.md,
        },
      })}
    >
      <Stack spacing="sm">
        {/* Header with Title */}
        <Text weight={600} size="lg">
          {trip.title}
        </Text>

        {/* Description */}
        <Text color="dimmed" size="sm">
          {trip.description}
        </Text>

        {/* Badges for City and Duration */}
        <Group spacing="sm">
          <Badge
            size="lg"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            leftSection={<IconMapPin size={14} />}
          >
            {trip.city}
          </Badge>
          <Badge
            size="lg"
            variant="gradient"
            gradient={{ from: "orange", to: "yellow" }}
            leftSection={<IconClock size={14} />}
          >
            {trip.duration_days} {trip.duration_days > 1 ? "Days" : "Day"}
          </Badge>
        </Group>

        {/* List of Suggested Activities */}
        <Stack spacing={5}>
          <Text weight={500} size="sm">
            Suggested Activities:
          </Text>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={20} radius="xl">
                <IconBulb size={12} />
              </ThemeIcon>
            }
          >
            {trip.suggested_activities.map((activity, index) => (
              <List.Item key={index}>
                <Text component="span" weight={500}>
                  {activity.name}:
                </Text>{" "}
                {activity.description}
              </List.Item>
            ))}
          </List>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SuggestedTrip;
