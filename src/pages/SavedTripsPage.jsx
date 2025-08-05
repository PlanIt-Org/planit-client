import React from "react";
import {
  Container,
  Flex,
  Box,
  useMantineTheme,
  Divider,
  Title,
} from "@mantine/core";
import NavBar from "../components/NavBar";
import TripGrid from "../components/TripGrid";
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

const SavedTripsPage = ({ setLocations, userId }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  return (
    <AnimatedFlex theme={theme} ismobile={isMobile ? "true" : "false"}>
      {!isMobile && <NavBar currentPage={2} setLocations={setLocations} />}

      {/* main content */}
      <AnimatedBox theme={theme} ismobile={isMobile ? "true" : "false"}>
        <Container size="lg" py="xl">
          <Title
            order={1}
            ta="center"
            mb="xl"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            style={{
              fontSize: isMobile
                ? "clamp(1.8rem, 5vw, 2.5rem)"
                : "clamp(2.2rem, 4vw, 3rem)",
            }}
          >
            Your Saved Trips
          </Title>
          <Divider
            my="sm"
            style={{
              borderColor: theme.colors["custom-palette"][6],
            }}
          />
          <TripGrid savedOnly={true} userId={userId} />
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
            backgroundColor: theme.colors["custom-palette"][8], // navbar bg
            borderTop: `1px solid ${theme.colors["custom-palette"][6]}`, // navbar border
          }}
        >
          <NavBar currentPage={2} setLocations={setLocations} />
        </Box>
      )}
    </AnimatedFlex>
  );
};

export default SavedTripsPage;
