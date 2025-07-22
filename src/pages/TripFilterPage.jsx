/* eslint-disable no-unused-vars */

import React from "react";

import {
  Title,
  Container,
  MultiSelect,
  Box,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Divider,
  CloseButton,
  Flex,
} from "@mantine/core";

import TripFilterSearchBox from "../components/TripFilterSearchBox";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { IconUser } from "@tabler/icons-react";

import NavBar from "../components/NavBar";

const TripFilterPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [manuallyAddedFilters, setManuallyAddedFilters] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  //TODO: (Dummy data start) Filler Data so we can see the buttons working, remove this once we have the actual data. Remove existingUser and existingFilters
  //(START of dummy data)
  const usersData = {
    "Emily Johnson": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
      email: "emily92@gmail.com",
      filter: ["Cafes & Coffee Shops"],
    },
    "Ava Rodriguez": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
      email: "ava_rose@gmail.com",
      filter: ["Restaurants & Dining"],
    },
    "Olivia Chen": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
      email: "livvy_globe@gmail.com",
      filter: ["Bars & Nightlife", "Outdoor Activities & Parks"],
    },
    "Ethan Barnes": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
      email: "ethan_explorer@gmail.com",
      filter: ["Live Music & Concerts"],
    },
    "Mason Taylor": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
      email: "mason_musician@gmail.com",
      filter: ["Theaters & Performing Arts"],
    },
  };
  //(END of dummy data)

  /**
   * Removes a selected user or filter from its corresponding state array.
   * @param {string} content - The user name or filter string to be removed.
   * @param {string} type - Specifies the list to modify, either 'users' or 'filters'.
   * @returns {void} This function does not return a value.
   */
  function handleRemove(content, type) {
    if (type === "users") {
      setSelectedUsers(selectedUsers.filter((user) => user !== content));
    } else {
      setSelectedFilters(
        selectedFilters.filter((filter) => filter !== content)
      );
    }
  }

  /**
   * Renders an array of strings as a list of dismissible Mantine Badge components.
   * @param {string[]} arrayOfContent - The array of strings (e.g., user names or filters) to display.
   * @param {string} type - The type ('users' or 'filters') to pass to the handleRemove function for the onClick event.
   * @returns {JSX.Element[]} An array of React Badge components.
   */
  function renderMultiSelectButtons(arrayOfContent, type) {
    return arrayOfContent.map((content) => (
      <Badge
        key={content}
        size="xl"
        variant="outline"
        p={0}
        radius="sm"
        rightSection={
          <Group gap="xs" align="center" wrap="nowrap">
            <Divider orientation="vertical" />
            <CloseButton
              size="sm"
              onClick={() => handleRemove(content, type)}
              aria-label={`Remove ${content}`}
            />
          </Group>
        }
      >
        <Text px="md" size="sm">
          {content}
        </Text>
      </Badge>
    ));
  }

  //TODO: Once the user is created, add the user to the existingUsers array
  //TODO: Once the filter is created in our json file, add the filter to the existingFilters array

  useEffect(() => {
    let allFilters = [...manuallyAddedFilters];
    selectedUsers.forEach((userName) => {
      const userFilters = usersData[userName]?.filter || [];
      allFilters.push(...userFilters);
    });
    const uniqueFilters = [...new Set(allFilters)];
    setSelectedFilters(uniqueFilters);
  }, [selectedUsers]);

  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar />
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
                justify="center"
                inputDesc={"Search for User"}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setSelectedUsers={setSelectedUsers}
                selectedUsers={selectedUsers}
                usersData={usersData}
                setCurrentUser={setCurrentUser}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
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
              <Group
                justify="center"
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: 0,
                  width: "100%",
                }}
              >
                <Button w="50%" onClick={() => navigate("/tripplanner")}>
                  Next
                </Button>
              </Group>
            </Stack>
          </Card>
        </Container>
      </Flex>
    </Flex>
  );
};

export default TripFilterPage;
