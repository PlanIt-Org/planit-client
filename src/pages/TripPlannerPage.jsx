import React, { useState, useEffect } from "react";
import TripPlannerMap from "../components/TripPlannerMap";
import { Button, Text, Box, Group, Stack } from "@mantine/core";
import { useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";
import { useNavigate } from "react-router-dom";

const TripPlannerPage = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false); // State to track API loading
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Group
        sx={{
          backgroundColor: "gray",
          width: "70%",
          height: "70%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flex: 1, height: "100%" }}>
          <TripPlannerMap
            selectedPlace={selectedPlace}
            marker={marker}
            markerRef={markerRef}
            onApiLoaded={() => setIsMapsApiLoaded(true)} // when api loaded notify
          />
        </Box>
        {/* right panel, section next to map w/ search bar, ai suggested trips, and button*/}
        <Stack
          sx={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "lightGray",
            height: "100%",
          }}
        >
          {/* only reneder when api is loaded */}
          {isMapsApiLoaded ? (
            <AutocompleteSearchField onPlaceSelected={setSelectedPlace} />
          ) : (
            <Text>Loading Google Maps API...</Text>
          )}

          <Box sx={{ backgroundColor: "darkGray", height: "80%", width: "80%" }}></Box>
          <Button variant="filled" sx={{ width: "80%" }} onClick={()=> { navigate('/tripsummary');}}>
            Let's Go!
          </Button>
        </Stack>
      </Group>
    </Box>
  );
};

export default TripPlannerPage;
