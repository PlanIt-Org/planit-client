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
import { useNavigate, useParams } from "react-router-dom";
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

  const handleAddUser = (userToAdd) => {
    if (!selectedUsers.some((user) => user.id === userToAdd.id)) {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };

 

  useEffect(() => {
    const filterCounts = {};

    selectedUsers.forEach((user) => {
      const allUserPreferences = [
        ...(user.userPreferences?.activityPreferences || []),
        ...(user.userPreferences?.dietaryRestrictions || []),
        ...(user.userPreferences?.travelStyle || []),
      ];

      allUserPreferences.forEach((preference) => {
        filterCounts[preference] = (filterCounts[preference] || 0) + 1;
      });
    });

    const filtersWithCounts = Object.entries(filterCounts).map(
      ([name, count]) => ({ name, count })
    );

    setSelectedFilters(filtersWithCounts);
  }, [selectedUsers]);
  /**
   * Removes a selected user by their ID.
   * @param {string} idToRemove - The unique ID of the user to be removed.
   * @param {string} type - Specifies the list to modify ('users' or 'filters').
   */
  function handleRemove(idToRemove, type) {
    if (type === "users") {
      setSelectedUsers(selectedUsers.filter((user) => user.id !== idToRemove));
    } else {
      setSelectedFilters(
        selectedFilters.filter((filter) => filter.name !== idToRemove)
      );
    }
  }

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
          {filterItem.name}
        </Badge>
      ));
    }

    return null;
  }

  const handleCreateGuestAndNavigate = async () => {
    const guestData = selectedUsers.map((user) => ({
      userId: user.id,
      email: user.email,
      name: user.name,
    }));

    try {
      const response = await apiClient.post(
        `/trips/${tripId}/proposed-guests`,
        guestData
      );

      navigate(`/tripplanner/${tripId}`);
    } catch (error) {
      console.error("Failed to create trip:", error);
      alert("Could not create the trip. Please try again.");
    }
  };

  return (
     <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
        flexDirection: isMobile ? "column" : "row",
      }} >
      {!isMobile && <NavBar currentPage={4} setLocations={setLocations} />}
      
    
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
                <Group justify="center" gap="sm">
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
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: 'var(--mantine-color-body)',
            borderTop: '1px solid var(--mantine-color-divider)',
          }}
        >
          <NavBar currentPage={4} setLocations={setLocations} />
        </Box>
      )}
    </Flex>
  );
};

export default TripFilterPage;
