import React, { useState, useEffect } from "react";
import { Text, Container, Flex, Box, Skeleton } from "@mantine/core";
import NavBar from "../components/NavBar";
import TripGrid from "../components/TripGrid";
import apiClient from "../api/axios";

const DiscoverTripsPage = ({ setLocations, userId }) => {
  const [preferredCity, setPreferredCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/users/preferences`);
        if (response.data && response.data.location) {
          setPreferredCity(response.data.location);
        }
      } catch (error) {
        console.error("Failed to fetch user preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar currentPage={1} setLocations={setLocations} />
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <Container size="lg" py="lg">
          <Text ta="center" fz="h2" fw={700} mb="xs">
            Discover Trips
          </Text>

          {/* This subtitle is now dynamic */}
          <Box h={30} mb="xl">
            {loading ? (
              <Skeleton height={30} width="300px" mx="auto" />
            ) : (
              <Text ta="center" size="xl">
                {preferredCity ? (
                  <>
                    Explore trips in{" "}
                    <Text
                      component="span"
                      fw={700}
                      variant="gradient"
                      gradient={{ from: "blue", to: "cyan" }}
                    >
                      {preferredCity}
                    </Text>
                  </>
                ) : (
                  "Recommended based on your preferences"
                )}
              </Text>
            )}
          </Box>

          <TripGrid userId={userId} discoverMode={true} />
        </Container>
      </Box>
    </Flex>
  );
};

export default DiscoverTripsPage;
