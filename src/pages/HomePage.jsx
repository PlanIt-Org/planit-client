/* eslint-disable no-unused-vars */
import React from "react";
import SearchBar from "../components/SearchBar";
import { Container, Title, Box, Group, Avatar, Button, Flex} from "@mantine/core";
import TripCategory from "../components/TripCategory";
import TripGrid from "../components/TripGrid";
import { useNavigate } from "react-router-dom";
import HomeLocationSearchBar from "../components/HomeLocationSearchBar";
import NavBar from "../components/NavBar";

const HomePage = () => {
  //TODO: if you want to add a custom avatar, like if the user wants to show there profile, or default, go here: https://mantine.dev/core/avatar/
  //TODO: Once the profile page is created, add the avatar to the profile page
  const navigate = useNavigate();
  return (

    <Flex
      style={{
        width: '100%',    
        minHeight: '100vh', 
        alignItems: 'stretch', 
      }}
    >
      <NavBar currentPage={0}/>
        {/* main content */}
      <Box
        style={{
          flex: 1, 
          minWidth: 0,
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        <Container size="mid" py="0"> 
          <Title order={1} ta="center" size={70} mb="lg">
            {" "}
            Welcome User!{" "}
          </Title>

          <HomeLocationSearchBar> </HomeLocationSearchBar>
          <TripCategory></TripCategory>
          {/*  Your Trips */}
          <TripGrid></TripGrid>

          {/* Public Trips, TODO: make this filter based off the user's location */}
          {/* <TripGrid title="Discover Trips"></TripGrid> */}
          </Container>
      </Box>
    </Flex>
  );
};

export default HomePage;
