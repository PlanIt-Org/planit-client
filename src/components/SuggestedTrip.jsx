// src/components/SuggestedTrip.jsx
import React from "react";
import { Paper, Text, Group, Badge, Stack, ThemeIcon } from "@mantine/core";
import { IconMapPin, IconTag } from "@tabler/icons-react";

const SuggestedTrip = ({ location }) => {
  if (!location) {
    return null;
  }

  return (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      sx={(theme) => ({
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows.md,
        },
        height: "100%",
      })}
    >
      <Stack justify="space-between" style={{ height: "100%" }}>
        {/* Top section with location and description */}
        <Stack spacing="sm">
          {/* Header with City Name */}
          <Group align="center" spacing="sm">
            <ThemeIcon color="blue" size={24} radius="xl">
              <IconMapPin size={16} />
            </ThemeIcon>
            <Text weight={700} size="xl">
              {location.city}
            </Text>
          </Group>

          {/* Description */}
          <Text color="dimmed" size="sm" mt="xs">
            {location.description}
          </Text>
        </Stack>

        {/* Bottom section with "Best for" tags */}
        <Stack spacing="sm" mt="md">
          <Text weight={500} size="sm">
            Best for:
          </Text>
          <Group spacing="xs">
            {/* Map over the 'best_for' array to create a Badge for each keyword */}
            {location.best_for &&
              location.best_for.map((tag, index) => (
                <Badge
                  key={index}
                  size="sm"
                  variant="light"
                  color="teal"
                  leftSection={<IconTag size={12} />}
                >
                  {tag}
                </Badge>
              ))}
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SuggestedTrip;
