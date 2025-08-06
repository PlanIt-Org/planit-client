// TripFilterPage.jsx

import React, { useState, useEffect } from "react";
import {
  Title,
  Container,
  Card,
  Stack,
  Group,
  Text,
  Divider,
  Badge,
  CloseButton,
  Button,
  Flex,
  Avatar,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import TripFilterSearchBox from "../components/TripFilterSearchBox";
import NavBar from "../components/NavBar";
import apiClient from "../api/axios";
import { useMediaQuery } from "@mantine/hooks";

const TripFilterPage = ({ setLocations }) => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const location = useLocation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [stagedUser, setStagedUser] = useState(null);

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await apiClient.get(`/users/search`, {
        params: { by: searchBy, query: trimmedQuery },
      });

      if (Array.isArray(response.data)) {
        const formattedData = response.data.map((user) => ({
          ...user,
          value: user.id,
        }));

        setSearchResults(formattedData);
      }
    } catch (error) {
      console.error("Failed to search for users:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [preferenceResponse, guestResponse] = await Promise.all([
          apiClient.get(`/trips/${tripId}/TripPreference`),
          apiClient.get(`/trips/${tripId}/proposed-guests`),
        ]);

        // --- Process Guests ---
        const guestList = guestResponse.data;
        if (guestList && guestList.length > 0) {
          const proposedGuestList = guestList.map((guest) => ({
            id: guest.id,
            name: guest.name,
          }));
          setSelectedUsers(proposedGuestList);
        }

        // --- Process Filters ---
        const preferenceSummary = preferenceResponse.data;

        if (preferenceSummary && Object.keys(preferenceSummary).length > 0) {
          let allActiveFilters = [];

          if (preferenceSummary.activityPreferences) {
            Object.entries(preferenceSummary.activityPreferences).forEach(
              ([key, count]) => {
                allActiveFilters.push({ name: key, count: count });
              }
            );
          }

          if (preferenceSummary.lifestyleChoices) {
            Object.entries(preferenceSummary.lifestyleChoices).forEach(
              ([key, count]) => {
                allActiveFilters.push({ name: key, count: count });
              }
            );
          }

          if (preferenceSummary.budget) {
            Object.entries(preferenceSummary.budget).forEach(([key, count]) => {
              allActiveFilters.push({ name: key, count: count });
            });
          }

          if (preferenceSummary.travelStyle) {
            Object.entries(preferenceSummary.travelStyle).forEach(
              ([key, count]) => {
                allActiveFilters.push({ name: key, count: count });
              }
            );
          }

          setSelectedFilters(allActiveFilters);
        }
      } catch (error) {
        console.error(
          "Failed to fetch initial trip data. This might be a new trip.",
          error
        );
      }
    };

    fetchInitialData();
  }, [tripId]);

  const recalculateFilters = (users) => {
    const filterCounts = {};

    users.forEach((user) => {
      if (user.userPreferences) {
        const allUserPreferences = [
          ...(user.userPreferences.activityPreferences || []),
          ...(user.userPreferences.dietaryRestrictions || []),
          ...(user.userPreferences.travelStyle || []),
          ...(user.userPreferences.lifestyleChoices || []),
        ];

        if (user.userPreferences.budget) {
          allUserPreferences.push(user.userPreferences.budget);
        }

        allUserPreferences.forEach((preference) => {
          filterCounts[preference] = (filterCounts[preference] || 0) + 1;
        });
      }
    });

    const filtersWithCounts = Object.entries(filterCounts).map(
      ([name, count]) => ({ name, count })
    );

    setSelectedFilters(filtersWithCounts);
  };

  const handleAddUser = (userToAdd) => {
    if (!selectedUsers.some((user) => user.id === userToAdd.id)) {
      const newUsers = [...selectedUsers, userToAdd];
      setSelectedUsers(newUsers);
      // Recalculate filters after adding a user
      recalculateFilters(newUsers);
    }
  };

  function handleRemove(idToRemove, type) {
    if (type === "users") {
      const newUsers = selectedUsers.filter((user) => user.id !== idToRemove);
      setSelectedUsers(newUsers);

      recalculateFilters(newUsers);
    } else {
      setSelectedFilters(
        selectedFilters.filter((filter) => filter.name !== idToRemove)
      );
    }
  }

  /**
   * Formats a filter name for display.
   * If the name is a number, it returns a string of dollar signs.
   * Otherwise, it returns the original name.
   * @param {string | number} name - The filter name to format.
   * @returns {string} The formatted name.
   */
  const formatFilterName = (name) => {
    if (!name) {
      return "";
    }

    const num = Number(name);

    if (!isNaN(num) && num >= 0) {
      return "$".repeat(num);
    }

    return name;
  };

  /**
   * Renders an array of items (either user objects or filter strings) as dismissible Badges.
   * @param {Array<object|string>} items - The array of items to display.
   * @param {string} type - The type ('users' or 'filters') to determine how to render.
   * @returns {JSX.Element[] | null} An array of React Badge components or null.
   */
  function renderMultiSelectButtons(items, type) {
    if (!items || items.length === 0) {
      return null;
    }

    if (type === "users") {
      return items.map((user) => (
        <Badge
          key={user.id}
          size="xl"
          variant="outline"
          p={0}
          radius="sm"
          rightSection={
            <Group gap="xs" align="center" wrap="nowrap">
              <Divider orientation="vertical" />
              <CloseButton
                size="sm"
                onClick={() => handleRemove(user.id, "users")}
                aria-label={`Remove ${user.name}`}
              />
            </Group>
          }
        >
          <Text px="md" size="sm">
            {user.name}
          </Text>
        </Badge>
      ));
    }

    if (type === "filters") {
      return items.map((filterItem) => (
        <Badge
          key={filterItem.name}
          variant="light"
          color="blue"
          radius="sm"
          size="lg"
          leftSection={
            filterItem.count > 1 ? (
              <Avatar size="md" color="blue" radius="xl">
                {filterItem.count}
              </Avatar>
            ) : null
          }
          rightSection={
            <CloseButton
              size="sm"
              onClick={() => handleRemove(filterItem.name, "filters")}
            />
          }
        >
          {formatFilterName(filterItem.name)}
        </Badge>
      ));
    }

    return null;
  }
  const handleCreateGuestAndNavigate = async () => {
    const aggregatedFilters = {
      activityPreferences: {},
      dietaryRestrictions: {},
      budgetDistribution: {},
      lifestyleChoices: {},
      travelStyle: {},
    };

    selectedFilters.forEach((filter) => {
      const knownActivities = [
        "Cafes & Coffee Shops",
        "Restaurants & Dining",
        "Bars & Nightlife",
        "Live Music & Concerts",
        "Theaters & Performing Arts",
        "Museums & Art Galleries",
        "Outdoor Activities & Parks",
        "Sports & Recreation",
        "Shopping",
        "Family-Friendly Attractions",
        "Unique & Trendy Spots",
      ];
      const knownDiets = [
        "Vegetarian",
        "Dairy-Free",
        "Gluten-Free",
        "Halal",
        "Kosher",
        "Pescatarian",
        "Vegan",
      ];
      const knownLifestyles = [
        "Active",
        "Relaxed",
        "Adventurous",
        "Cultural",
        "Social",
        "Family-Oriented",
        "Night Owl",
        "Early Bird",
      ];
      const knownStyles = ["Quick Hangouts", "Day Trips"];
      const knownBudgets = ["1", "2", "3", "4"];

      if (knownActivities.includes(filter.name)) {
        aggregatedFilters.activityPreferences[filter.name] = filter.count;
      } else if (knownDiets.includes(filter.name)) {
        aggregatedFilters.dietaryRestrictions[filter.name] = filter.count;
      } else if (knownLifestyles.includes(filter.name)) {
        aggregatedFilters.lifestyleChoices[filter.name] = filter.count;
      } else if (knownStyles.includes(filter.name)) {
        aggregatedFilters.travelStyle[filter.name] = filter.count;
      } else if (knownBudgets.includes(filter.name)) {
        aggregatedFilters.budgetDistribution[filter.name] = filter.count;
      }
    });

    const guestData = selectedUsers.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
    }));

    try {
      await apiClient.post(`/trips/${tripId}/guests`, guestData);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }

    //send the propostedGuest to the backend

    // Send the correctly built object to the backend
    try {
      await apiClient.post(
        `/trips/${tripId}/TripPreference`,
        aggregatedFilters
      );
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }

    navigate(`/tripplanner/${tripId}`);
  };

  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {!isMobile && <NavBar currentPage={0} />}
      {isMobile && <NavBar currentPage={0} />}

      <Flex
        style={{ flex: 1, padding: "2rem" }}
        justify="center"
        align="center"
      >
        <Container size="md" w="100%">
          <Card
            shadow="sm"
            p="xl"
            radius="md"
            withBorder
            style={{ minHeight: 750 }}
          >
            <Stack gap="xl">
              <Title order={2} ta="center">
                Add Guests & Filters
              </Title>

              <TripFilterSearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                searchResults={searchResults}
                onSearch={handleSearch}
                onAddUser={handleAddUser}
                selectedUsers={selectedUsers}
                setSelectedFilters={setSelectedFilters}
                setSearchResults={setSearchResults}
                stagedUser={stagedUser}
                setStagedUser={setStagedUser}
              />

              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Selected Guests:
                </Text>
                <Group>
                  {renderMultiSelectButtons(selectedUsers, "users")}
                </Group>
              </Stack>
              <Divider />
              <Stack gap="xs">
                <Title order={4} ta="center">
                  Filters Applied
                </Title>
                <Group
                  justify="center"
                  gap="sm"
                  style={{
                    maxHeight: 250,
                    overflowY: "auto",
                    paddingRight: 8,
                  }}
                >
                  {renderMultiSelectButtons(selectedFilters, "filters")}
                </Group>
              </Stack>
            </Stack>

            <Group
              justify="center"
              style={{
                position: "absolute",
                bottom: 32,
                left: 0,
                width: "100%",
              }}
            >
              <Button w="50%" onClick={() => handleCreateGuestAndNavigate()}>
                Next
              </Button>
            </Group>
          </Card>
        </Container>
      </Flex>
      {isMobile && (
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: "var(--mantine-color-body)",
            borderTop: "1px solid var(--mantine-color-divider)",
          }}
        ></Box>
      )}
    </Flex>
  );
};

export default TripFilterPage;
