import React from "react";
import {
  Container,
  Title,
  Text,
  List,
  ThemeIcon,
  Box,
  SimpleGrid,
  rem,
} from "@mantine/core";
import {
  IconCheck,
  IconMapPin,
  IconClock,
  IconUsers,
  IconSettings,
  IconBulb,
} from "@tabler/icons-react";

const LandingDescription = () => {
  return (
    <Container size="lg" py="xl">
      <Box ta="center" mb="xl">
        <Title order={1} fw={700} c="custom-palette.7" mb="md">
          Say Goodbye to Planning Headaches with PlanIt!
        </Title>
        <Text size="lg" c="custom-palette.6" maw={800} mx="auto">
          Planning a hangout, trip, or other event can be complex, often
          requiring multiple apps for navigation, transport, weather, and
          location info. Instagram polls go unanswered, and it's hard to put the
          cognitive effort forward to make a plan happen. Even then, people have
          their own preferences based on mood, dietary restrictions, and more.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl" mt="xl">
        <Box
          p="md"
          style={{
            backgroundColor: "custom-palette.0",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <ThemeIcon
            variant="light"
            size="lg"
            radius="md"
            mb="sm"
            color="custom-palette"
          >
            <IconMapPin style={{ width: rem(24), height: rem(24) }} />
          </ThemeIcon>
          <Title order={4} fw={600} c="custom-palette.7" mb="xs">
            All-in-One Planning
          </Title>
          <Text size="sm" c="custom-palette.6">
            PlanIt streamlines event organization by solving multi-app
            dependency, offering a single, user-friendly platform.
          </Text>
        </Box>

        <Box
          p="md"
          style={{
            backgroundColor: "custom-palette.0",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <ThemeIcon
            variant="light"
            size="lg"
            radius="md"
            mb="sm"
            color="custom-palette"
          >
            <IconClock style={{ width: rem(24), height: rem(24) }} />
          </ThemeIcon>
          <Title order={4} fw={600} c="custom-palette.7" mb="xs">
            Streamlined Itineraries
          </Title>
          <Text size="sm" c="custom-palette.6">
            Create new trips, search for and add multiple locations to build
            sequential and organized plans. See travel times and realistic
            schedules between locations.
          </Text>
        </Box>

        <Box
          p="md"
          style={{
            backgroundColor: "custom-palette.0",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <ThemeIcon
            variant="light"
            size="lg"
            radius="md"
            mb="sm"
            color="custom-palette"
          >
            <IconUsers style={{ width: rem(24), height: rem(24) }} />
          </ThemeIcon>
          <Title order={4} fw={600} c="custom-palette.7" mb="xs">
            Effortless Collaboration
          </Title>
          <Text size="sm" c="custom-palette.6">
            Generate unique shareable links, invite friends & colleagues, RSVP
            (Yes, No, Maybe), add comments, and send out rapid polls.
          </Text>
        </Box>

        <Box
          p="md"
          style={{
            backgroundColor: "custom-palette.0",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <ThemeIcon
            variant="light"
            size="lg"
            radius="md"
            mb="sm"
            color="custom-palette"
          >
            <IconSettings style={{ width: rem(24), height: rem(24) }} />
          </ThemeIcon>
          <Title order={4} fw={600} c="custom-palette.7" mb="xs">
            Personalized Experiences
          </Title>
          <Text size="sm" c="custom-palette.6">
            Filter preferences based on known constraints, input your
            preferences once, and tailor your trip for what you have in mind.
          </Text>
        </Box>

        <Box
          p="md"
          style={{
            backgroundColor: "custom-palette.0",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <ThemeIcon
            variant="light"
            size="lg"
            radius="md"
            mb="sm"
            color="custom-palette"
          >
            <IconBulb style={{ width: rem(24), height: rem(24) }} />
          </ThemeIcon>
          <Title order={4} fw={600} c="custom-palette.7" mb="xs">
            Smart Recommendations
          </Title>
          <Text size="sm" c="custom-palette.6">
            PlanIt recommends locations based on your questionnaire and past
            trip data, saving you cognitive effort.
          </Text>
        </Box>

        <Box
          p="md"
          style={{
            backgroundColor: "custom-palette.0",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <ThemeIcon
            variant="light"
            size="lg"
            radius="md"
            mb="sm"
            color="custom-palette"
          >
            <IconCheck style={{ width: rem(24), height: rem(24) }} />
          </ThemeIcon>
          <Title order={4} fw={600} c="custom-palette.7" mb="xs">
            Effortless Execution
          </Title>
          <Text size="sm" c="custom-palette.6">
            Add events to your personal calendar with one click, see details
            like weather and hours without switching apps, and easily share past
            trips.
          </Text>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default LandingDescription;
