import React, { useState, useEffect } from "react";
import {
  Text,
  Container,
  Flex,
  Box,
  Skeleton,
  useMantineTheme,
  Paper,
  Title,
} from "@mantine/core";
import NavBar from "../components/NavBar";
import TripGrid from "../components/TripGrid";
import apiClient from "../api/axios";
import { useMediaQuery } from "@mantine/hooks";

const DiscoverTripsPage = ({ setLocations, userId }) => {
  const theme = useMantineTheme();
  const [preferredCity, setPreferredCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

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
        flexDirection: isMobile ? "column" : "row",
        background: theme.colors["custom-palette"][9], // match HomePage background
      }}
    >
      {!isMobile && <NavBar currentPage={1} setLocations={setLocations} />}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: isMobile ? "16px" : "20px",
          boxSizing: "border-box",
          paddingBottom: isMobile ? "80px" : "20px",
          background: theme.colors["custom-palette"][9], // match HomePage content background
        }}
      >
        <Container size="lg" py="lg">
          <Title
            order={1}
            ta="center"
            mb="xs"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            style={{
              fontSize: isMobile
                ? "clamp(1.8rem, 5vw, 2.5rem)"
                : "clamp(2.2rem, 4vw, 3rem)",
            }}
          >
            Discover Trips
          </Title>
          <Paper
            p="md"
            radius="md"
            mb="xl"
            style={{
              backgroundColor: theme.colors["custom-palette"][8],
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Skeleton height={30} width="300px" />
            ) : (
              <Text ta="center" size="xl" fw={500}>
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
          </Paper>
          <TripGrid userId={userId} discoverMode={true} />
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
            backgroundColor: theme.colors["custom-palette"][8],
            borderTop: `1px solid ${theme.colors["custom-palette"][6]}`,
          }}
        >
          <NavBar currentPage={1} setLocations={setLocations} />
        </Box>
      )}
    </Flex>
  );
};

export default DiscoverTripsPage;
