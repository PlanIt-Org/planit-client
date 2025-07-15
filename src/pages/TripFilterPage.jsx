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
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TripFilterPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  //State for the selected users and filters
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  //TODO: Filler Data so we can see the buttons working, remove this once we have the actual data
  const existingUsers = ["User1", "User2", "User3", "User4", "User5"];
  const existingFilters = [
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

  const [active, setActive] = useState(existingUsers[0]);

  function renderMultiSelectButtons(arrayOfContent, type) {
    return arrayOfContent.map((content) => (
      <Button
        key={content}
        variant={
          type == "users"
            ? selectedUsers.includes(content)
              ? "outline"
              : "light"
            : type == "filters"
            ? selectedFilters.includes(content)
              ? "outline"
              : "light"
            : "light"
        }
        color="blue"
        onClick={() => handleButtonClick(content, type)}
      >
        {content}
      </Button>
    ));
  }
  //TODO: Once the user is created, add the user to the existingUsers array
  //TODO: Once the filter is created in our json file, add the filter to the existingFilters array

  function handleButtonClick(content, type) {
    if (type == "users" && !selectedUsers.includes(content)) {
      setSelectedUsers([...selectedUsers, content]);
    } else if (type == "filters" && !selectedFilters.includes(content)) {
      setSelectedFilters([...selectedFilters, content]);
    } else if (type == "users" && selectedUsers.includes(content)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== content));
    } else {
      setSelectedFilters(
        selectedFilters.filter((filter) => filter !== content)
      );
    }
  }
  return (
    <Container size="md" my={40} py="lg" justify="center" align="center">
      {
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <>
            <Box mb="xl" mt="xl" w="100%">
              <SearchBar
                mb="xl"
                mt="xl"
                justify="center"
                inputDesc={"Search for User"}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              ></SearchBar>
            </Box>

            <Stack gap="xl" justify="center" align="center">
             


              <Container size="md" py="xl">
                <Title order={1} ta="center" mb="xl">
                  Current Filters Applied
                </Title>

                <Group justify="center" gap="sm">
                  {renderMultiSelectButtons(existingFilters)}
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
  //   <Badge
  //   size="xl"         
  //   variant="outline" 
  //   p={0}          
  //   radius="sm"
  //   rightSection={
     
  //     <Group gap="xs" align="center" wrap="nowrap">
  //       <Divider orientation="vertical" />
  //       <CloseButton
  //         size="sm"
  //         // onClick={handleRemove}
  //         aria-label="Remove filter"
  //       />
  //     </Group>
  //   }
  // >
   
  //   <Text px="md" size="sm">
  //     FilterName
  //   </Text>
  // </Badge>
  );
};

export default TripFilterPage;
