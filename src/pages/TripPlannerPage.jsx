// src/pages/TripPlannerPage.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  Box,
  Stack,
  Flex,
  useMantineTheme,
  Paper,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import apiClient from "../api/axios";
import { supabase } from "../supabaseClient";
import TripPlannerMap from "../components/TripPlannerMap";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";
import DragDropLocations from "../components/DragDropLocations";
import SuggestedTripContainer from "../components/SuggestedTripContainer";
import NavBar from "../components/NavBar";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// --- Emotion Animations & Styled Components ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const floatUp = keyframes`
  from {
    opacity: 0;
    margin-top: 20px;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
`;
// A full-page wrapper that uses the theme's background color
const PageWrapper = styled(Flex)`
  width: 100%;
  min-height: 100vh;
  align-items: stretch;
  background: ${({ theme }) => theme.colors["custom-palette"][7]};
  animation: ${fadeIn} 0.5s ease-out;
`;

// The main content container with centering and padding
const ContentContainer = styled(Box)`
  flex: 1;
  min-width: 0;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// The main panel, styled as a Paper component to inherit theme styles
const PlannerPanel = styled(Paper)`
  height: 85vh;
  width: 85vw;
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  overflow: hidden;
  animation: ${floatUp} 0.6s ease-out 0.2s forwards;
  opacity: 0;
  background-color: ${({ theme }) => theme.colors["custom-palette"][8]};
`;

const MapSection = styled(Box)`
  flex: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchSection = styled(Stack)`
  flex: 2;
  height: 100%;
  justify-content: flex-start;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors["custom-palette"][7]};
`;

const InteractiveButton = styled(Button)`
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const TripPlannerPage = ({
  selectedCity,
  ownTrip,
  setOwnTrip,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [locations, setLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);


  // Effect to fetch trip data
  useEffect(() => {
    if (!id) {
      notifications.show({
        title: "Invalid Page Access",
        message: "This page requires a trip ID. Redirecting...",
        color: "orange",
      });
      navigate("/home");
      return;
    }

    const fetchTripAndCheckOwnership = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const loggedInUserId = session?.user?.id;

        const res = await apiClient.get(`/trips/${id}`);
        const tripData = res.data.trip;

        setOwnTrip(loggedInUserId && tripData.hostId === loggedInUserId);
        setLocations(tripData.locations || []);
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
        notifications.show({
          title: "Trip Not Found",
          message: `Could not load the trip with ID: ${id}.`,
          color: "red",
        });
        navigate("/home");
      }
    };

    fetchTripAndCheckOwnership();
  }, [id, navigate, setOwnTrip]);

  // Effect to add a selected place to locations
  useEffect(() => {
    if (selectedPlace && selectedPlace.place_id) {
      const alreadyExists = locations.some(
        (loc) => loc.googlePlaceId === selectedPlace.place_id
      );
  
      if (!alreadyExists) {
        const newLocation = {
          googlePlaceId: selectedPlace.place_id,
          name: selectedPlace.name,
          address: selectedPlace.formatted_address,
          geometry: selectedPlace.geometry,
          types: selectedPlace.types,
          imageUrl: selectedPlace.photos?.[0]?.getUrl() || null,
          isNew: true,
        };
  
        setLocations((prevLocations) => [...prevLocations, newLocation]);
        setSelectedPlace(null);
      }
    }
  }, [selectedPlace, setSelectedPlace, locations]);

  // Handler for saving the trip
  const handleLetsGoClick = async () => {
    if (locations.length === 0) {
      notifications.show({
        title: "No Locations Selected!",
        message: "Please add at least one location before proceeding.",
        color: "red",
      });
      return;
    }

    try {
      // ... (rest of the saving logic remains the same)
      for (const loc of locations) {
        const locationPayload = {
          place_id: loc.googlePlaceId || loc.place_id,
          name: loc.name,
          formatted_address: loc.address || loc.formatted_address,
          geometry: {
            location: {
              lat:
                loc.latitude ||
                (typeof loc.geometry?.location?.lat === "function"
                  ? loc.geometry.location.lat()
                  : loc.geometry?.location?.lat),
              lng:
                loc.longitude ||
                (typeof loc.geometry?.location?.lng === "function"
                  ? loc.geometry.location.lng()
                  : loc.geometry?.location?.lng),
            },
          },
          types: loc.types,
          image_url: loc.image || loc.imageUrl || null,
        };
        const createRes = await apiClient.post("/locations", locationPayload);
        await apiClient.post(`/trips/${id}/locations`, {
          locationId: createRes.data.id,
        });
      }
      notifications.show({
        title: "Success!",
        message: "Your trip has been saved.",
        color: "green",
      });
      navigate(`/tripsummary/${id}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      const message =
        error.response?.data?.message || error.message || "An error occurred.";
      notifications.show({ title: "Error Saving Trip", message, color: "red" });
    }
  };

  return (
    <PageWrapper theme={theme}>
      {!isMobile && <NavBar currentPage={0}/>}

      <ContentContainer isMobile={isMobile}>
        <PlannerPanel isMobile={isMobile} theme={theme}>
          <MapSection isMobile={isMobile}>
            <TripPlannerMap
              selectedPlace={selectedPlace}
              locations={locations}
              selectedCity={selectedCity}
              showRoutes={false}
              mapHeight={isMobile ? "300px" : "50%"}
            />
            <Box style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
              <Text size="lg" fw={700} my="lg" ta="center">
                Your Trip Locations
              </Text>
              <DragDropLocations
                locations={locations}
                setLocations={setLocations}
                id={id}
              />
            </Box>
          </MapSection>

          <SearchSection isMobile={isMobile} theme={theme}>
            <Stack>
              <AutocompleteSearchField onPlaceSelected={setSelectedPlace} />
              <Text fw={700} ta="center">
                AI Suggested Trips
              </Text>
              <Box
                style={{
                  flex: 1,
                  overflowY: "auto",
                  minHeight: isMobile ? "150px" : "auto",
                }}
              >
                <SuggestedTripContainer />
              </Box>
            </Stack>
            <InteractiveButton
              onClick={handleLetsGoClick}
              size="lg"
              radius="xl"
              fullWidth
              mt="md"
              theme={theme}
            >
              Let's Go
            </InteractiveButton>
          </SearchSection>
        </PlannerPanel>
      </ContentContainer>

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
          <NavBar currentPage={0} />
        </Box>
      )}
    </PageWrapper>
  );
};

export default TripPlannerPage;
