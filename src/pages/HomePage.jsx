import React from "react";
import SearchBar from "../components/SearchBar";
import { Container, Title, Box, Group } from "@mantine/core";
import TripCategory from "../components/TripCategory";
import TripGrid from "../components/TripGrid";
import { Avatar } from "@mantine/core";

const HomePage = () => {
  //TODO: if you want to add a custom avatar, like if the user wants to show there profile, or default, go here: https://mantine.dev/core/avatar/
  //TODO: Once the profile page
  //TODO: Once Go is clicked, it should take you to the trip filter page

  return (
    <Container size="mid" py="lg">
      {
        <>
          <Group justify="flex-end">
            <Avatar variant="transparent" radius="sm" size="lg" src="" />
          </Group>

          <Title order={1} ta="center" size={70}>
            {" "}
            Welcome User!{" "}
          </Title>

          <SearchBar> </SearchBar>
          <TripCategory></TripCategory>
          <TripGrid></TripGrid>
        </>
      }
    </Container>
  );
};

export default HomePage;
