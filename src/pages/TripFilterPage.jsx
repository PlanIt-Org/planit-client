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
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import TripFilterSearchBox from "../components/TripFilterSearchBox";
import NavBar from "../components/NavBar";
import apiClient from "../api/axios";

const TripFilterPage = ({ setCurrTripId }) => {
  const navigate = useNavigate();
  // State for the search input text
  const [searchQuery, setSearchQuery] = useState("");
  // State for the search type dropdown ('name' or 'email')
  const [searchBy, setSearchBy] = useState("name");
  // State to hold the results from the API call
  const [searchResults, setSearchResults] = useState([]);
  // State to hold the users who have been added to the trip
  const [selectedUsers, setSelectedUsers] = useState([]);
  // State for the combined filters
  const [selectedFilters, setSelectedFilters] = useState([]);

  // --- This is the function that fetches the data ---
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
        // Format the data for Mantine Autocomplete
        const formattedData = response.data.map(user => ({
          ...user,
          value: user.id, // Use a unique ID for the key
        }));

        console.log("Data being passed to Autocomplete:", formattedData); 
        setSearchResults(formattedData);
      }
    } catch (error) {
      console.error("Failed to search for users:", error);
    }
  };

  // --- This function adds a user to the list ---
  const handleAddUser = (userToAdd) => {
    // Prevent adding duplicates
    if (!selectedUsers.some(user => user.id === userToAdd.id)) {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };

  const handleRemoveUser = (userIdToRemove) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userIdToRemove));
  };

  // This effect recalculates filters whenever the selectedUsers list changes
  useEffect(() => {
    const allFilters = [];
    selectedUsers.forEach((user) => {
      if (user.activityPreferences && user.activityPreferences.length > 0) {
        allFilters.push(...user.activityPreferences);
      }
    });
    const uniqueFilters = [...new Set(allFilters)];
    setSelectedFilters(uniqueFilters);
    console.log(uniqueFilters, "Filters")
  }, [selectedUsers]);

  return (
    <Flex style={{ width: "100%", minHeight: "100vh", alignItems: "stretch" }}>
      <NavBar setCurrTripId={setCurrTripId} />
      <Flex style={{ flex: 1, padding: "2rem" }} justify="center" align="center">
        <Container size="md" w="100%">
          <Card shadow="sm" p="xl" radius="md" withBorder style={{ minHeight: 750 }}>
            <Stack gap="xl">
              <Title order={2} ta="center">
                Add Guests & Filters
              </Title>
              
              {/* --- HERE is where you pass everything down as props --- */}
              <TripFilterSearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                searchResults={searchResults} // Pass the API results down
                onSearch={handleSearch}      // Pass the search function down
                onAddUser={handleAddUser}      // Pass the add function down
                selectedUsers={selectedUsers} 
                setSelectedFilters = {setSelectedFilters}
              />

              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Selected Guests:
                </Text>
                <Group>
                  {/* Updated rendering logic for user objects */}
                  {selectedUsers.map((user) => (
                    <Badge key={user.id} /* ... */ >
                      <Text px="md" size="sm">{user.name}</Text>
                    </Badge>
                  ))}
                </Group>
              </Stack>
              {/* ... rest of your JSX ... */}
            </Stack>
          </Card>
        </Container>
      </Flex>
    </Flex>
  );
};

export default TripFilterPage;