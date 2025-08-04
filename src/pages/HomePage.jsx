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
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect } from "react";
import TripCategory from "../components/TripCategory";
import TripGrid from "../components/TripGrid";
import { useNavigate } from "react-router-dom";
import HomeLocationSearchBar from "../components/HomeLocationSearchBar";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

const HomePage = ({
  selectedCity,
  setSelectedCity,
  isMapsApiLoaded,
  setCurrTripId,
  user,
  setLocations,
}) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const categories = [
    "Upcoming",
    "Drafts",
    "Invited Trips",
    "Hosting",
    "Past Events",
  ];

  const name = user?.user_metadata?.display_name;

  const [active, setActive] = useState(categories[0]);

  useEffect(() => {
    setSelectedCity("");
  }, []);

  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {!isMobile && <NavBar currentPage={0} setLocations={setLocations} />}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: isMobile ? "16px" : "20px",
          boxSizing: "border-box",
          paddingBottom: isMobile ? "80px" : "20px",
        }}
      >
        <Container size="mid" py="0">
          <Title
            order={1}
            ta="center"
            size={isMobile ? "h2" : 55}
            mb={isMobile ? "md" : "lg"}
            style={{
              fontSize: isMobile
                ? "clamp(1.5rem, 4vw, 2.5rem)"
                : "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Welcome {name}!
          </Title>
          {/* only show search bar when API fully loaded */}
          {isMapsApiLoaded ? (
            <HomeLocationSearchBar
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              user={user}
            />
          ) : (
            <Text ta="center" size="md" c="dimmed" mt="lg">
              Loading Google Maps API and Places services...
            </Text>
          )}
          <Box mt={isMobile ? "md" : "lg"}>
            <TripCategory
              categories={categories}
              active={active}
              setActive={setActive}
            />
          </Box>
          {/*  Your Trips */}
          <Box mt={isMobile ? "md" : "lg"}>
            <TripGrid
              userId={user?.id}
              setCurrTripId={setCurrTripId}
              active={active}
            />
          </Box>

          {/* Public Trips, TODO: make this filter based off the user's location */}
          {/* <TripGrid title="Discover Trips"></TripGrid> */}
        </Container>
      </Box>
      {isMobile && (
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "var(--mantine-color-body)",
            borderTop: "1px solid var(--mantine-color-gray-3)",
          }}
        ></Box>
      )}
       {isMobile && <NavBar currentPage={0} setLocations={setLocations} />}
    </Flex>
  );
};

export default HomePage;
