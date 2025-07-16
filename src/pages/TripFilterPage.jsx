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
} from "@mantine/core";
import TripFilterSearchBox from "../components/TripFilterSearchBox";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconUser } from "@tabler/icons-react";


const TripFilterPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  //State for the selected users and filters
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  //TODO: (Dummy data start) Filler Data so we can see the buttons working, remove this once we have the actual data
  

  //TODO: Remove existingUser and existingFilters
  const usersData = {
    "Emily Johnson": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
      email: "emily92@gmail.com",
      filter: ["Cafes & Coffee Shops"]
    },
    "Ava Rodriguez": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
      email: "ava_rose@gmail.com",
      filter: ["Restaurants & Dining"]
    },
    "Olivia Chen": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
      email: "livvy_globe@gmail.com",
      filter: ["Bars & Nightlife", "Outdoor Activities & Parks"]
    },
    "Ethan Barnes": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
      email: "ethan_explorer@gmail.com",
      filter: ["Live Music & Concerts"]
    },
    "Mason Taylor": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
      email: "mason_musician@gmail.com",
      filter: ["Theaters & Performing Arts"]
    },
  };
  //(Dummy date end)

 

  function handleRemove(content, type) {
    if (type === "users") {
      setSelectedUsers(selectedUsers.filter((user) => user !== content));
    } else {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== content));

    }
  }

  console.log(selectedUsers, "selectedUsers");
  console.log(selectedFilters, "selectedFilters");
  // Your render function with the corrected onClick handler
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
              // This arrow function ensures the correct 'content' and 'type' are passed
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


  const TripFilterPage = () => {
   
   
    useEffect(() => {
   
      let allFilters = [];

      selectedUsers.forEach(userName => {
      
        const userFilters = usersData[userName]?.filter || [];
    
        allFilters = [...allFilters, ...userFilters];
      });
  
    
      const uniqueFilters = [...new Set(allFilters)];
      
  
      setSelectedFilters(uniqueFilters);
  
    }, [selectedUsers]);

  }
  return (
    <Container size="md" my={40} py="lg" justify="center" align="center">
      {
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <>
            <Box mb="xl" mt="xl" w="100%">
              <TripFilterSearchBox
                mb="xl"
                mt="xl"
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
              ></TripFilterSearchBox>
            </Box>

            <Stack gap="xl" justify="center" align="center">
              <Container size="md" py="xl">
                <Group>
                  {renderMultiSelectButtons(selectedUsers, "users")}
                </Group>
              </Container>

              <Title order={1} ta="center" mb="sm">
                 Filters Applied
              </Title>
              <Container size="md" py="xl">
                <Group justify="center" gap="sm">
                  {renderMultiSelectButtons(selectedFilters, "filters")}
                </Group>
              </Container>

              <Button w="50%" onClick={() => navigate("/tripPlanner")}>
                Next
              </Button>
            </Stack>
          </>
        </Card>
      }
    </Container>

  );
};

export default TripFilterPage;
