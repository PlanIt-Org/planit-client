import React, { useEffect } from "react";
import TripPlannerMap from "../components/TripPlannerMap";
import { Button, Text, Box, Group, Stack, Flex } from "@mantine/core";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";
import { useNavigate } from "react-router-dom";
import DragDropLocations from "../components/DragDropLocations";
import SuggestedTripContainer from "../components/SuggestedTripContainer";
import NavBar from "../components/NavBar";
import { notifications } from "@mantine/notifications";

// TODO: add AI suggested trips
const TripPlannerPage = ({
  selectedCity,
  locations,
  setLocations,
  selectedPlace,
  setSelectedPlace,
  currTripId,
  setCurrTripId,
}) => {
  const navigate = useNavigate();

  // use effect that adds currently selected place to a locations array
  useEffect(() => {
    if (selectedPlace) {
      setLocations((prevLocations) => {
        // don't allow duplicates
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
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    }

    try {
      for (const loc of locations) {
        const locationPayload = {
          place_id: loc.place_id,
          name: loc.name,
          formatted_address: loc.formatted_address,
          geometry: {
            location: {
              lat: loc.geometry.location.lat(),
              lng: loc.geometry.location.lng(),
            },
            viewport: {
              northeast: {
                lat: loc.geometry.viewport.getNorthEast().lat(),
                lng: loc.geometry.viewport.getNorthEast().lng(),
              },
              southwest: {
                lat: loc.geometry.viewport.getSouthWest().lat(),
                lng: loc.geometry.viewport.getSouthWest().lng(),
              },
            },
          },
          types: loc.types,
        };

        // Step 1: Create the location
        const createRes = await fetch("http://localhost:3000/api/locations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(locationPayload),
        });

        if (!createRes.ok) {
          throw new Error(`Failed to create location: ${loc.name}`);
        }

        const createdLocation = await createRes.json();
        const locationId = createdLocation.id;

        // Step 2: Add it to the trip
        const addToTripRes = await fetch(
          `http://localhost:3000/api/trips/${currTripId}/locations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ locationId }),
          }
        );

        if (!addToTripRes.ok) {
          throw new Error(`Failed to add ${loc.name} to trip.`);
        }
      }

      navigate(`/tripsummary/${currTripId}`);
    } catch (error) {
      console.error("Error creating locations:", error);
      notifications.show({
        title: "Error Saving Locations",
        message:
          error.message || "An error occurred while saving your locations.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
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
      <NavBar setCurrTripId={setCurrTripId} setLocations={setLocations} />
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
