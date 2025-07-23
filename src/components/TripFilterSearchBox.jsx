import React from "react";
import {
  TextInput,
  Button,
  Group,
  Autocomplete,
  Text,
  ActionIcon,
  rem,
  Select,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Avatar } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { Notification } from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import apiClient from "../api/axios";

const TripFilterSearchBox = ({
  searchQuery,
  setSearchQuery,
  usersData,
  setSelectedUsers,
  selectedUsers,
  setCurrentUser,
  setSelectedFilters,
  selectedFilters,
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [searchBy, setSearcBy] = useState("name");
  const [search, setSearch] = useState(false);
  const [searchedData, setSearchedData] = useState([])

  

  const renderAutocompleteOption = ({ option }) => (
    <Group gap="sm">
      <div>
        <Text size="sm">{option.name}</Text>
        <Text size="xs" opacity={0.5}>
          {option.email}
        </Text>
      </div>
    </Group>
  );

  async function fetchUsersAPI(searchQuery) {
    searchQuery.trim();

    try {
      const response = await apiClient.get(`/users/search`, {
        params: {
          by: searchBy,
          query: searchQuery,
        },
      });

      console.log(response.data)
      console.log(search)
    

      return response.data;
      
    } catch (error) {
      console.error("Failed to search for users:", error);
    }
  }

  /**
   * Handles the logic for adding a new user to the selected list.
   * It reads the user's name from the `searchQuery` state. If the user
   * has already been selected, it shows a warning notification. Otherwise,
   * it adds the user to the `selectedUsers` array, updates the
   * `selectedFilters` with the combined unique filters, and sets the `currentUser`.
   * @returns {void} This function does not return a value; it updates component state.
   */
  function handleAddUser() {
    if (selectedUsers.includes(searchQuery)) {
      setShowNotification(true);
      return;
    }
    setSelectedUsers([...selectedUsers, searchQuery]);
    const uniqueFilters = [
      ...new Set([...selectedFilters, ...usersData[searchQuery].filter]),
    ];
    setSelectedFilters(uniqueFilters);
    setCurrentUser(searchQuery);
  }

  const names = Object.keys(usersData);
  const xIcon = <IconX size={20} />;

  async function handleSearch() {
    setSearch(true)
    searchQuery = searchQuery.trim();

    const usersFromApi = await fetchUsersAPI(searchQuery);

    const formattedData = usersFromApi.map(user => ({
      ...user, // id, name, email, etc.
      value: user.id, 
    }));
    setSearchedData(formattedData);

  }

  return (
    <>
      <Group
        gap="sm"
        justify="center"
        align="flex-end"
        style={{ width: "100%" }}
      >
        <Select
          label="Search By"
          style={{ width: 100 }}
          placeholder="Name"
          data={["email", "name"]}
          value = {searchBy}
          onChange = {(newValue) => setSearcBy(newValue)}
        />
        <Autocomplete
          data={searchedData}
          value={searchQuery}
          renderOption={renderAutocompleteOption}
          onChange={setSearchQuery}
          maxDropdownHeight={300}
          placeholder="Search for User"
          leftSection={
            <ActionIcon
              onClick={handleSearch}
              variant="transparent"
              color="gray"
            >
              <IconSearch style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
          }
          style={{ minWidth: 200 }}
        />

        <Button onClick={() => handleAddUser()}> Add </Button>
      </Group>
      <Group gap="sm" justify="center">
        {showNotification && (
          <Notification
            icon={xIcon}
            color="red"
            title="Error!"
            onClose={() => setShowNotification(false)}
          >
            User has already been added!
          </Notification>
        )}
      </Group>
    </>
  );
};

export default TripFilterSearchBox;
