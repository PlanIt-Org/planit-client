import React from "react";
import { Text, Container, Flex, Box, useMantineTheme } from "@mantine/core";
import NavBar from "../components/NavBar";
import TripGrid from "../components/TripGrid";
import { useMediaQuery } from "@mantine/hooks";

const SavedTripsPage = ({ setLocations, userId }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
        background: theme.colors["custom-palette"][7], // page background
      }}
    >
      {!isMobile && <NavBar currentPage={2} setLocations={setLocations} />}

      {/* main content */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: 20,
          boxSizing: "border-box",
          background: theme.colors["custom-palette"][7], // content background
        }}
      >
        <Container size="lg" py="xl">
          <Text ta="center" fw={700} size="3rem" mb="xl">
            Your Saved Trips
          </Text>

          <TripGrid savedOnly={true} userId={userId} />
        </Container>
      </Box>
      {isMobile && (
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: theme.colors["custom-palette"][8], // navbar bg
            borderTop: `1px solid ${theme.colors["custom-palette"][6]}`, // navbar border
          }}
        >
          <NavBar currentPage={2} setLocations={setLocations} />
        </Box>
      )}
    </Flex>
  );
};

export default SavedTripsPage;
