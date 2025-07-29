// src/components/SuggestedTripContainer.jsx
import React, { useEffect } from "react";
import TripPlannerMap from "../components/TripPlannerMap";
import { Button, Text, Box, Group, Stack, Flex } from "@mantine/core";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";
import { useNavigate, useParams } from "react-router-dom";
import DragDropLocations from "../components/DragDropLocations";
import SuggestedTripContainer from "../components/SuggestedTripContainer";
import NavBar from "../components/NavBar";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import apiClient from "../api/axios";
import { supabase } from "../supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TripPlannerPage = ({
  selectedCity,
  locations,
  setLocations,
  selectedPlace,
  setSelectedPlace,
  currTripId,
  setCurrTripId,
  ownTrip,
  setOwnTrip,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

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
        const tripData = res.data;

        if (loggedInUserId && tripData.hostId === loggedInUserId) {
          setOwnTrip(true);
        } else {
          setOwnTrip(false);
        }

        setCurrTripId(tripData.id);
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
  }, [id, navigate, setCurrTripId, setLocations]);

  useEffect(() => {
    if (selectedPlace) {
      setLocations((prevLocations) => {
        if (
          !prevLocations.some((loc) => loc.place_id === selectedPlace.place_id)
        ) {
          return [...prevLocations, selectedPlace];
        }
        return prevLocations;
      });
    }
  }, [selectedPlace]);

  useEffect(() => {
    console.log("new locations order: ", locations);
  }, [locations]);

  const handleLetsGoClick = async () => {
    if (locations.length === 0) {
      notifications.show({
        title: "No Locations Selected!",
        message:
          "Please add at least one location to your trip before proceeding.",
        color: "red",
      });
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        notifications.show({
          title: "Login Required",
          message: "Please log in to save your trip.",
          color: "red",
        });
        return;
      }

      let tripId = currTripId || id;

      if (!ownTrip) {
        const originalTripRes = await apiClient.get(`/trips/${currTripId}`);
        const originalTrip = originalTripRes.data;

        const newTripRes = await apiClient.post("/trips", {
          startTime: originalTrip.startTime,
          endTime: originalTrip.endTime,
          title: `${originalTrip.title} (Copy)`,
          description: originalTrip.description || "",
          city: originalTrip.city || selectedCity?.name || null,
          tripImage: originalTrip.tripImage || null,
          maxGuests: originalTrip.maxGuests || null,
        });

        tripId = newTripRes.data.trip.id;
        setCurrTripId(tripId);
        setOwnTrip(true);
      }

      for (const loc of locations) {
        const locationPayload = {
          place_id: loc.place_id,
          name: loc.name,
          formatted_address: loc.formatted_address,
          geometry: {
            location: {
              lat:
                typeof loc.geometry.location.lat === "function"
                  ? loc.geometry.location.lat()
                  : loc.geometry.location.lat,
              lng:
                typeof loc.geometry.location.lng === "function"
                  ? loc.geometry.location.lng()
                  : loc.geometry.location.lng,
            },
          },
          types: loc.types,
          image_url: loc.imageUrl || null,
        };

        const createRes = await apiClient.post("/locations", locationPayload);
        const locationId = createRes.data.id;

        await apiClient.post(`/trips/${tripId}/locations`, { locationId });
      }

      notifications.show({
        title: "Success!",
        message: "Your trip has been saved.",
        color: "green",
      });
      navigate(`/tripsummary/${tripId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while saving your trip.";
      notifications.show({
        title: "Error Saving Trip",
        message: message,
        color: "red",
      });
    }
  };

  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar setLocations={setLocations} />
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/*container for the map and search field, arranged horizontally */}
        <Group
          style={{
            height: "80vh",
            width: "80vw",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            gap: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
          }}
        >
          {/* trip planner map & locations container*/}
          <Box
            style={{
              flex: "3",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: "20px 0 0 20px",
            }}
          >
            <TripPlannerMap
              selectedPlace={selectedPlace}
              locations={locations}
              selectedCity={selectedCity}
              showRoutes={false}
              mapHeight="50%"
              style={{ flex: "2" }}
            />

            {/* added locations */}
            <Box style={{ flex: "1", overflowY: "auto", padding: "10px" }}>
              {/* Added a container for locations with scroll */}
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

          {/* auto complete search stack */}
          <Stack
            style={{
              flex: "2",
              height: "100%",
              justifyContent: "flex-start",
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <AutocompleteSearchField onPlaceSelected={setSelectedPlace} />
            {/*  TODO: change to add AI suggested trips */}
            <Text fw={700} ta="center">
              AI Suggested Trips based on your preferences
            </Text>
            <Box style={{ flex: 1, overflowY: "auto" }}>
              <SuggestedTripContainer />
            </Box>
            <Button
              onClick={handleLetsGoClick}
              size="lg"
              radius="xl"
              fw={700}
              style={{
                marginTop: 24,
                marginBottom: 8,
                width: "100%",
                minHeight: 56,
                fontSize: 22,
                letterSpacing: 1,
              }}
            >
              Let's Go
            </Button>
          </Stack>
        </Group>
      </Box>
    </Flex>
  );
};

export default TripPlannerPage;
