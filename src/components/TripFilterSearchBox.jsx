// TripFilterSearchBox.jsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Group,
  Autocomplete,
  Text,
  ActionIcon,
  rem,
  Select,
  Notification,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

const TripFilterSearchBox = ({
  searchQuery,
  setSearchQuery,
  searchBy,
  setSearchBy,
  searchResults,
  onSearch,
  onAddUser,
  selectedUsers,
  setSelectedFilters ,
  setSearchResults,
}) => {
  const [stagedUser, setStagedUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const renderAutocompleteOption = ({ option }) => {
    const user = searchResults.find((item) => item.id === option.value);
    if (!user) return null;
    return (
      <Group gap="sm">
        <div>
          <Text size="sm">{user.name}</Text>
          <Text size="xs" opacity={0.5}>
            {user.email}
          </Text>
        </div>
      </Group>
    );
  };

  useEffect(() => {
    const allFilters = [];

    selectedUsers.forEach((user) => {

      if (user.activityPreferences && user.activityPreferences.length > 0) {
        allFilters.push(...user.activityPreferences);
      }
    });

    const uniqueFilters = [...new Set(allFilters)];

    setSelectedFilters(uniqueFilters);
  }, [selectedUsers]);



  const handleUserSelect = (optionValue) => {
    const userObject = searchResults.find(user => user.id === optionValue);
    if (userObject) {
      setStagedUser(userObject);
      setSearchQuery(userObject.name); 
    }
  };

  const handleAddClick = () => {
    if (stagedUser) {
      if (selectedUsers.some((user) => user.id === stagedUser.id)) {
        setShowNotification(true);
        return;
      }
      onAddUser(stagedUser);
      setSearchQuery("");
      setStagedUser(null); 
      setSearchResults("");
    }
  };

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
          style={{ width: 120 }}
          data={["name", "email"]}
          value={searchBy}
          onChange={setSearchBy}
          allowDeselect={false}
        />
        <Autocomplete
          label="&nbsp;"
          data={searchResults}
          value={searchQuery}
          onChange={setSearchQuery}
          renderOption={renderAutocompleteOption}
          onOptionSubmit={handleUserSelect}
          placeholder="Search for user..."
          style={{ flexGrow: 1 }}
          leftSection={
            <ActionIcon onClick={onSearch} variant="transparent" color="gray">
              <IconSearch style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
          }
          filter={({ options, search }) => options}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSearch();
            }
          }}
        />
        <Button onClick={handleAddClick}>Add</Button>
      </Group>
      <Group mt="md">
        {showNotification && (
          <Notification
            icon={<IconX size={20} />}
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