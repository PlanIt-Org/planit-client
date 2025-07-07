import React, { useState, useRef, useEffect } from "react";
import { Container, Button, Box, TextField } from "@mui/material";
import TripPlanningMap from "../components/TripPlanningMap";

import { useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Ensure this is correctly set in .env


const TripPlanning = () => {

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false); // State to track API loading


  return (
    <Container
      sx={{
        bgcolor: "gray",
        width: "70%",
        height: "70%",
        display: "flex",
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: "row",
      }}
    >
      <Box sx={{ flex: 1, height: "80%"}}>
       <TripPlanningMap
          selectedPlace={selectedPlace}
          marker={marker}
          markerRef={markerRef}
          onApiLoaded={() => setIsMapsApiLoaded(true)} // Set state when API is loaded
        />
      </Box>
      {/* section next to map w/ search bar, ai suggested trips, and button*/}
      <Container
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "lightGray",
          height: "80%",
        }}
      >
         {/* --- Conditionally render AutocompleteSearchField --- */}
        {isMapsApiLoaded ? (
          <AutocompleteSearchField onPlaceSelected={setSelectedPlace} />
        ) : (
          <TextField // Show a loading state for the TextField while API loads
            id="search-place-autocomplete-loading"
            label="Loading map and search..."
            variant="outlined"
            fullWidth
            disabled
            sx={{ mb: 3, width: '80%' }}
          />
        )}

        <Box sx={{ bgcolor: "red", height: "80%", width: "80%" }}></Box>
        <Button variant="contained" fullWidth sx={{ width: '80%' }}>Let's Go!</Button>
      </Container>
    </Container>
  );
};


export default TripPlanning;
