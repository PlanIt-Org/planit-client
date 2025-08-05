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
  Box
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
  const [selectedFilters, setSelectedFilters] = useState([]); //stores the selected filter
  const location = useLocation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [stagedUser, setStagedUser] = useState(null);

  const isNewTrip = location.state?.isNew;

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
    // setAllUsers(...userToAdd)
    console.log("I choose", selectedUsers);
  };

  //this function fetch the Trip Preference if they exist
  async function fetchTripPreference() {
    try {
      const response = await apiClient.get(`/trips/${tripId}/TripPreference`);

      const preferenceSummary = response.data;
      console.log("Fetched preference summary:", preferenceSummary);

      if (preferenceSummary) {
        let allActiveFilters = [];

        if (preferenceSummary.activityPreferences) {
          Object.entries(preferenceSummary.activityPreferences).forEach(
            ([key, count]) => {
              allActiveFilters.push({ name: key, count: count });
            }
          );
        }
        if (preferenceSummary.dietaryRestrictions) {
          Object.entries(preferenceSummary.dietaryRestrictions).forEach(
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
        if (preferenceSummary.travelStyle) {
          Object.entries(preferenceSummary.travelStyle).forEach(
            ([key, count]) => {
              allActiveFilters.push({ name: key, count: count });
            }
          );
        }
        if (preferenceSummary.budgetDistribution) {
          Object.entries(preferenceSummary.budgetDistribution).forEach(
            ([key, count]) => {
              allActiveFilters.push({ name: key, count: count });
            }
          );
        }

        console.log("Setting selected filters to:", allActiveFilters);
        setSelectedFilters(allActiveFilters);
      }
    } catch (error) {
      return; //new Trip
    }
  }

  //This function fetches the proposed Guest
  async function fetchPropostedGuest() {
    try {
      const response = await apiClient.get(`/trips/${tripId}/proposed-guests`);

      const guestList = response.data;
      console.log("My G list ", guestList);

      let PropostedGuestList = {
        id: null,
        name: null,
      };

      const proposedGuestList = guestList.map((guest) => {
        // For each 'guest' in the original array,
        // return a new object with only the properties you want.
        return {
          id: guest.id,
          name: guest.name,
        };
      });

      setSelectedUsers(proposedGuestList);

      // Now, 'proposedGuestList' is a new array with the transformed objects.
      console.log("My new proposed guest list ", proposedGuestList);
    } catch (error) {
      return; //new Trip
    }
  }

  useEffect(() => {
    console.log("Fetching existing trip data...");
    fetchTripPreference();
    fetchPropostedGuest();
  }, [tripId]);

  useEffect(() => {
    const filterCounts = {};

    selectedUsers.forEach((user) => {
      const allUserPreferences = [
        ...(user.userPreferences?.activityPreferences || []),
        ...(user.userPreferences?.dietaryRestrictions || []),
        ...(user.userPreferences?.travelStyle || []),
        ...(user.userPreferences?.lifestyleChoices || []),
        ...(user.userPreferences?.budget || []),
      ];

      console.log("all user prefeernce", allUserPreferences);

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
      console.log("Items", items);
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
    const guestData = selectedUsers.map((user) => ({
      userId: user.id,
      email: user.email,
      name: user.name,
    }));

    //Add the guests to the proposedGuestList
    try {
      const response = await apiClient.post(
        `/trips/${tripId}/guests`,
        guestData
      );
    } catch (error) {
      console.error("Failed to create trip:", error);
    }

    //Add the filters to the TripPreference
    const aggregatedFilters = {
      activityPreferences: {},
      dietaryRestrictions: {},
      budgetDistribution: {},
      lifestyleChoices: {},
      travelStyle: {},
    };

    const selectedFilterNames = selectedFilters.map((filter) => filter.name);

    selectedUsers.forEach((user) => {
      const prefs = user.userPreferences;
      console.log("All selected filters", selectedFilterNames);
      if (!prefs) {
        return;
      }

      if (prefs.activityPreferences) {
        prefs.activityPreferences.forEach((pref) => {
          if (selectedFilterNames.includes(pref.trim())) {
            aggregatedFilters.activityPreferences[pref] =
              (aggregatedFilters.activityPreferences[pref] || 0) + 1;
          }
        });
      }

      if (prefs.dietaryRestrictions) {
        prefs.dietaryRestrictions.forEach((pref) => {
          if (selectedFilterNames.includes(pref)) {
            aggregatedFilters.dietaryRestrictions[pref] =
              (aggregatedFilters.dietaryRestrictions[pref] || 0) + 1;
          }
        });
      }

      if (prefs && prefs.budget) {
        if (selectedFilterNames.includes(prefs.budget)) {
          aggregatedFilters.budgetDistribution[prefs.budget] =
            (aggregatedFilters.budgetDistribution[prefs.budget] || 0) + 1;
        }
      }

      if (prefs.lifestyleChoices) {
        prefs.lifestyleChoices.forEach((pref) => {
          if (selectedFilterNames.includes(pref)) {
            aggregatedFilters.lifestyleChoices[pref] =
              (aggregatedFilters.lifestyleChoices[pref] || 0) + 1;
          }
        });
      }

      if (prefs.travelStyle) {
        prefs.travelStyle.forEach((pref) => {
          if (selectedFilterNames.includes(pref)) {
            aggregatedFilters.travelStyle[pref] =
              (aggregatedFilters.travelStyle[pref] || 0) + 1;
          }
        });
      }
    });

    console.log("All the Filters", aggregatedFilters);

    //Add the tripFilters to the Filter
    try {
      const response = await apiClient.post(
        `/trips/${tripId}/TripPreference`,
        aggregatedFilters
      );
    } catch (error) {
      console.error("Failed to create trip:", error);
      alert("Could not create the trip. Please try again.");
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
      }} >
      {!isMobile ?  (
        <NavBar currentPage={0} setLocations={setLocations} />
      ) : (<NavBar currentPage={0} setLocations={setLocations}/>  )}
      
    
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
