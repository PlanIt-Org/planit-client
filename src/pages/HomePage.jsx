import React from "react";
import SearchBar from "../components/SearchBar";
import { Container, Title, Box, Group, Avatar, Button} from "@mantine/core";
import TripCategory from "../components/TripCategory";
import TripGrid from "../components/TripGrid";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  //TODO: if you want to add a custom avatar, like if the user wants to show there profile, or default, go here: https://mantine.dev/core/avatar/
  //TODO: Once the profile page is created, add the avatar to the profile page
  const navigate = useNavigate();
  return (
    <Container size="mid" py="lg">
      {
        <>
          <Group justify="flex-end">
            <Button onClick={() => navigate("/profile")} variant="transparent">
            <Avatar variant="transparent" radius="sm" size="lg" src="" />
            </Button>
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
