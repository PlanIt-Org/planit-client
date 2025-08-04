// src/pages/TripPlannerPage.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  Box,
  Stack,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import apiClient from "../api/axios";
import { supabase } from "../supabaseClient";
import TripPlannerMap from "../components/TripPlannerMap";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";
import DragDropLocations from "../components/DragDropLocations";
import SuggestedTripContainer from "../components/SuggestedTripContainer";
import NavBar from "../components/NavBar";

const TripPlannerPage = ({
  selectedCity,
  locations,
  setLocations,
  selectedPlace,
  setSelectedPlace,
  ownTrip,
  setOwnTrip,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

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
        const { data: { session } } = await supabase.auth.getSession();
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
  }, [id, navigate, setOwnTrip, setLocations]);

  // Effect to add a selected place to locations
  useEffect(() => {
    if (selectedPlace) {
      setLocations((prevLocations) => {
        if (!prevLocations.some((loc) => loc.place_id === selectedPlace.place_id)) {
          return [...prevLocations, selectedPlace];
        }
        return prevLocations;
      });
    }
  }, [selectedPlace, setLocations]);

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
              lat: loc.latitude || (typeof loc.geometry?.location?.lat === "function" ? loc.geometry.location.lat() : loc.geometry?.location?.lat),
              lng: loc.longitude || (typeof loc.geometry?.location?.lng === "function" ? loc.geometry.location.lng() : loc.geometry?.location?.lng),
            },
          },
          types: loc.types,
          image_url: loc.image || loc.imageUrl || null,
        };
        const createRes = await apiClient.post("/locations", locationPayload);
        await apiClient.post(`/trips/${id}/locations`, { locationId: createRes.data.id });
      }
      notifications.show({ title: "Success!", message: "Your trip has been saved.", color: "green" });
      navigate(`/tripsummary/${id}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      const message = error.response?.data?.message || error.message || "An error occurred.";
      notifications.show({ title: "Error Saving Trip", message, color: "red" });
    }
  };

  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
        flexDirection: "row", // Always row, content will wrap or stack inside
      }}
    >
      {/* DESKTOP NAVBAR: Rendered on the side */}
      {!isMobile && <NavBar currentPage={0} setLocations={setLocations} />}

      {/* MAIN CONTENT WRAPPER */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: isMobile ? "16px" : "20px",
          paddingBottom: isMobile ? '80px' : '20px', // Space for bottom nav on mobile
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        {/* UNIFIED LAYOUT: This Flex container handles both mobile and desktop */}
        <Flex
          direction={isMobile ? "column" : "row"}
          gap="20px"
          style={{
            height: isMobile ? "auto" : "80vh",
            width: isMobile ? "100%" : "80vw",
            boxShadow: isMobile ? 'none' : "0 8px 20px rgba(0, 0, 0, 0.15)",
            backgroundColor: isMobile ? 'transparent' : "#ffffff",
            borderRadius: isMobile ? 0 : "20px",
            overflow: isMobile ? 'visible' : 'hidden',
          }}
        >
          {/* Left Column: Map & Locations */}
          <Box
            style={{
              flex: isMobile ? '1 1 auto' : "3",
              height: isMobile ? 'auto' : "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: isMobile ? "12px" : "20px 0 0 20px",
              backgroundColor: isMobile ? '#fff' : 'transparent',
              boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <TripPlannerMap
              selectedPlace={selectedPlace}
              locations={locations}
              selectedCity={selectedCity}
              showRoutes={false}
              mapHeight={isMobile ? "300px" : "50%"}
              style={{ flex: isMobile ? 'none' : "2" }}
            />
            <Box style={{ flex: isMobile ? 'none' : "1", overflowY: "auto", padding: "10px" }}>
              <Text size="lg" fw={700} my="lg" ta="center">
                Your Trip Locations:
              </Text>
              <DragDropLocations
                locations={locations}
                setLocations={setLocations}
                id={id}
              />
            </Box>
          </Box>

          {/* Right Column: Search & Suggestions */}
          <Stack
            style={{
              flex: isMobile ? '1 1 auto' : "2",
              height: isMobile ? 'auto' : "100%",
              justifyContent: "flex-start",
              padding: "20px",
              borderRadius: isMobile ? '12px' : '0',
              backgroundColor: "#ffffff",
              boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <AutocompleteSearchField onPlaceSelected={setSelectedPlace} />
            <Text fw={700} ta="center">
              AI Suggested Trips
            </Text>
            <Box style={{ flex: 1, overflowY: "auto", minHeight: isMobile ? '150px' : 'auto' }}>
              <SuggestedTripContainer />
            </Box>
            <Button
              onClick={handleLetsGoClick}
              size="lg"
              radius="xl"
              fw={700}
              style={{
                marginTop: 24,
                width: "100%",
                minHeight: 56,
                fontSize: isMobile ? 18 : 22,
              }}
            >
              Let's Go
            </Button>
          </Stack>
        </Flex>
      </Box>

      {/* MOBILE NAVBAR: Rendered fixed at the bottom */}
      {isMobile && (
        <Box
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: 'var(--mantine-color-body)',
            borderTop: '1px solid var(--mantine-color-divider)',
          }}
        >
          <NavBar currentPage={0} setLocations={setLocations} />
        </Box>
      )}
    </Flex>
  );
};

export default TripPlannerPage;
