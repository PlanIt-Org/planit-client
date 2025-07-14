import React, { useState, useEffect } from "react";
import TripPlannerMap from "../components/TripPlannerMap";
import { Button, Text, Box, Group, Stack } from "@mantine/core";
import { useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";
import { useNavigate } from "react-router-dom";
import DragDropLocations from "../components/DragDropLocations";
import SuggestedTrip from "../components/SuggestedTrip";

const TripPlannerPage = () => {
  const [locations, setLocations] = useState([]); // TODO: change this later. teporarily storing the locations
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false); // google maps api fully loaded
  const navigate = useNavigate();


  // use effect that adds currently selected place to a locations array
  useEffect(() => {
    if (selectedPlace) {
      setLocations((prevLocations) => {
        // don't allow duplicates
        if (!prevLocations.some(loc => loc.place_id === selectedPlace.place_id)) {
          return [...prevLocations, selectedPlace];
        }
        return prevLocations; 
      });
    }
  }, [selectedPlace]);



  useEffect(() => {
    console.log("new locations order: ", locations)
  }, [locations]);


  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/*container for the map and search field, arranged horizontally */}
      <Group
        style={{
          height: "80vh",
          width: "90vw",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          gap: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#ffffff",
          borderRadius: '20px'
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
            marker={marker}
            markerRef={markerRef}
            onApiLoaded={() => setIsMapsApiLoaded(true)}
            locations={locations}
            style={{ flex: "2" }}
          />

          {/* added locations */}
          <Box style={{ flex: "1", overflowY: "auto", padding: "10px" }}>
            {/* Added a container for locations with scroll */}
            <Text size="lg" fw={700} mb="sm">
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
          {/* conditionally render AutocompleteSearchField */}
          {isMapsApiLoaded ? (
            <AutocompleteSearchField onPlaceSelected={setSelectedPlace} />
          ) : (
            <Text size="md">
              Loading Google Maps API and Places services...
            </Text>
          )}
          <SuggestedTrip></SuggestedTrip>
          <SuggestedTrip></SuggestedTrip>
          <SuggestedTrip></SuggestedTrip>
          <SuggestedTrip></SuggestedTrip>
          <SuggestedTrip></SuggestedTrip>
          <Button
            onClick={() => {
              navigate("/tripsummary");
            }}
          >
            Let's Go
          </Button>
        </Stack>
      </Group>
    </Box>
  );
};

export default TripPlannerPage;
