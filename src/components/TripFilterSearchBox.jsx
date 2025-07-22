import React from "react";
import { TextInput, Button, Group, Autocomplete, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Avatar } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { Notification } from "@mantine/core";
import { useState } from "react";

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

  const renderAutocompleteOption = ({ option }) => (
    <Group gap="sm">
      <Avatar src={usersData[option.value].image} size={36} radius="xl" />
      <div>
        <Text size="sm">{option.value}</Text>
        <Text size="xs" opacity={0.5}>
          {usersData[option.value].email}
        </Text>
      </div>
    </Group>
  );

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

  return (
    <>
      <Group gap="sm" justify="center">
        <Autocomplete
          data={
            searchQuery.trim().length > 0
              ? names.filter((user) =>
                  user.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : []
          }
          value={searchQuery}
          renderOption={renderAutocompleteOption}
          onChange={setSearchQuery}
          maxDropdownHeight={300}
          placeholder="Search for User"
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
