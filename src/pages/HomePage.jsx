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
  Divider,
} from "@mantine/core";
import { useEffect } from "react";
import TripCategory from "../components/TripCategory";
import TripGrid from "../components/TripGrid";
import { useNavigate } from "react-router-dom";
import HomeLocationSearchBar from "../components/HomeLocationSearchBar";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import TwinklingStars from "../components/TwinklingStars";
import apiClient from "../api/axios"; 


const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const AnimatedFlex = styled(Flex)`
  width: 100%;
  min-height: 100vh;
  align-items: stretch;
  flex-direction: ${({ ismobile }) => (ismobile === "true" ? "column" : "row")};
  background: ${({ theme }) => theme.colors["custom-palette"][7]};
  animation: ${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
`;

const AnimatedBox = styled(Box)`
  flex: 1;
  min-width: 0;
  padding: ${({ ismobile, theme }) =>
    ismobile === "true" ? theme.spacing.md : theme.spacing.lg};
  box-sizing: border-box;
  padding-bottom: ${({ ismobile }) => (ismobile === "true" ? "80px" : "20px")};
  background: ${({ theme }) => theme.colors["custom-palette"][7]};
  animation: ${fadeIn} 0.9s cubic-bezier(0.4, 0, 0.2, 1);
`;

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

  const [displayName, setDisplayName] = useState("");
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get("/users/me");
        
        if (response.data?.name) {
          setDisplayName(response.data.name);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setDisplayName("User");
      }
    };

    fetchUserProfile();
  }, []);

  const [active, setActive] = useState(categories[0]);

  useEffect(() => {
    setSelectedCity("");
  }, [setSelectedCity]);

  return (
    <AnimatedFlex theme={theme} ismobile={isMobile ? "true" : "false"}>
      <TwinklingStars />
      {!isMobile && <NavBar currentPage={0} setLocations={setLocations} />}

      <AnimatedBox theme={theme} ismobile={isMobile ? "true" : "false"}>
        <Container size="mid" py="0">
          <Title
            order={1}
            ta="center"
            justify="center"
            size={isMobile ? "h2" : 55}
            mb={isMobile ? "md" : "lg"}
            variant="gradient"
            gradient={{ from: "blue", to: "white" }}
            style={{
              fontSize: isMobile
                ? "clamp(1.5rem, 4vw, 2.5rem)"
                : "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "0.5px",
              transition: "color 0.3s",
            }}
          >
            Welcome {displayName}!
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
          <Divider
            my="sm"
            style={{
              borderColor: theme.colors["custom-palette"][6],
            }}
          />
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
      </AnimatedBox>
      {isMobile && (
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: theme.colors["custom-palette"][3],
            borderTop: `1px solid ${theme.colors["custom-palette"][6]}`,
          }}
        ></Box>
      )}
      {isMobile && <NavBar currentPage={0} />}
    </AnimatedFlex>
  );
};

export default HomePage;
