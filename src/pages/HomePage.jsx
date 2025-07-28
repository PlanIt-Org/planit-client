/* eslint-disable no-unused-vars */
import React from "react";
import {
  Container,
  Title,
  Box,
  Group,
  Avatar,
  Button,
  Flex,
  Text
} from "@mantine/core";
import { useEffect } from "react";
import TripCategory from "../components/TripCategory";
import TripGrid from "../components/TripGrid";
import { useNavigate } from "react-router-dom";
import HomeLocationSearchBar from "../components/HomeLocationSearchBar";
import NavBar from "../components/NavBar";
import { useState } from "react";

const HomePage = ({selectedCity, setSelectedCity, isMapsApiLoaded, setCurrTripId, user, setLocations }) => {
  const navigate = useNavigate();

  const categories = [
    "Upcoming",
    "Drafts",
    "Invited Trips",
    "Hosting",
    "Past Events",
  ];

  const [active, setActive] = useState(categories[0]);

  // reset seelected city once going back to home page
  useEffect(() => {
   setSelectedCity("");
  }, []);
  
  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar currentPage={0} setCurrTripId={setCurrTripId} setLocations={setLocations}/>
      {/* main content */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <Container size="mid" py="0">
          <Title order={1} ta="center" size={70} mb="lg">
            Welcome User!
          </Title>

        {/* only show search bar when API fully loaded */}
          {isMapsApiLoaded ? (
            <HomeLocationSearchBar selectedCity={selectedCity} setSelectedCity={setSelectedCity} setCurrTripId={setCurrTripId} user={user}> </HomeLocationSearchBar>          ) : (
            <Text ta="center" size="md" c="dimmed" mt="lg">
              Loading Google Maps API and Places services...
            </Text>
          )}
          <TripCategory categories={categories} active={active} setActive={setActive}></TripCategory>
          {/*  Your Trips */}
          <TripGrid userId={user} setCurrTripId={setCurrTripId} active={active}></TripGrid>

          {/* Public Trips, TODO: make this filter based off the user's location */}
          {/* <TripGrid title="Discover Trips"></TripGrid> */}
        </Container>
      </Box>
    </Flex>
  );
};

export default HomePage;
