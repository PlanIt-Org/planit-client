import React from "react";
import { Text, Container, Flex, Box } from "@mantine/core";
import NavBar from "../components/NavBar";
import TripGrid from "../components/TripGrid";

const SavedTripsPage = ({ setLocations, userId }) => {
  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar currentPage={2} setLocations={setLocations} />

      {/* main content */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <Container size="lg" py="xl">
          <Text
            ta="center"
            fw={700}
            size="3rem"
            mb="xl"
          >
            Your Saved Trips
          </Text>

          <TripGrid savedOnly={true} userId={userId}/>
        </Container>
      </Box>
    </Flex>
  );
};

export default SavedTripsPage;
