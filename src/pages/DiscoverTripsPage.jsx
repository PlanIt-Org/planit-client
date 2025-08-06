import React, { useState, useEffect } from "react";
import {
  Text,
  Container,
  Flex,
  Box,
  Skeleton,
  useMantineTheme,
  Title,
  Divider,
} from "@mantine/core";
import NavBar from "../components/NavBar";
import TripGrid from "../components/TripGrid";
import apiClient from "../api/axios";
import { useMediaQuery } from "@mantine/hooks";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

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

const DiscoverTripsPage = ({ userId }) => {
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
    <AnimatedFlex theme={theme} ismobile={isMobile ? "true" : "false"}>
      {!isMobile && <NavBar currentPage={1} />}
      <AnimatedBox theme={theme} ismobile={isMobile ? "true" : "false"}>
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
          <Box
            p="md"
            radius="md"
            mb="xl"
            style={{
              backgroundColor: theme.colors["custom-palette"][7],
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
                      gradient={{ from: "blue", to: "white" }}
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
          <Divider
            my="sm"
            style={{
              borderColor: theme.colors["custom-palette"][6],
            }}
          />
          <TripGrid userId={userId} discoverMode={true} />
        </Container>
      </AnimatedBox>
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
          <NavBar currentPage={1} />
        </Box>
      )}
    </AnimatedFlex>
  );
};

export default DiscoverTripsPage;
